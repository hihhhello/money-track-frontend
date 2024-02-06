'use client';

import { Fragment, ReactNode, useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { DialogOverlay } from '../../Dialog/DialogOverlay';
import { DialogContent } from '../../Dialog/DialogContent';
import { CategoryItem } from '../../Category/CategoryItem';
import { CategoryList } from '../../Category/CategoryList';
import { Input } from '../../Input';
import { DialogHeader } from '../../Dialog/DialogHeader';
import { DollarInput } from '../../DollarInput';
import { isEmpty, isNil } from 'lodash';
import { DialogActions } from '../../Dialog/DialogActions';
import { DialogScrollableContent } from '../../Dialog/DialogScrollableContent';
import { CategoryListLoading } from '../../Category/CategoryListLoading';
import { useBoolean } from 'hihhhello-utils';
import { twMerge } from 'tailwind-merge';
import { ManageTransactionModalCategories } from './components/ManageTransactionModalCategories';

type TransactionValues = {
  amount: number | null;
  date: string;
  description: string | null;
};

type ManageTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (transactionValues: {
    amount: string;
    date: string;
    description: string | null;
    categoryId: number;
  }) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultValues?: {
    amount: string;
    date: string;
    description: string | null;
  };
  handleDelete?: () => Promise<void> | undefined | void;
  selectedCategoryId: number | null;
  spendingGroups: Array<{ id: number; name: string }> | undefined;
  isSpendingGroupsLoading?: boolean;
  selectedSpendingGroupIds: number[];
  handleSelectSpendingGroupId: (id: number) => void;
  handleClearSpendingGroups: () => void;
  children?: ReactNode;
};

export const ManageTransactionModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  submitButtonLabel,
  title,
  defaultValues: defaultValues,
  handleDelete,
  selectedCategoryId,
  spendingGroups,
  isSpendingGroupsLoading,
  selectedSpendingGroupIds,
  handleSelectSpendingGroupId,
  handleClearSpendingGroups,
  children,
}: ManageTransactionModalProps) => {
  const {
    setTrue: handleSetTrueSpendingGroupsShownState,
    ...spendingGroupsShownState
  } = useBoolean(false);

  useEffect(() => {
    if (isEmpty(selectedSpendingGroupIds)) {
      return;
    }

    handleSetTrueSpendingGroupsShownState();
  }, [handleSetTrueSpendingGroupsShownState, selectedSpendingGroupIds]);

  const today = formatISO(new Date(), { representation: 'date' });

  useEffect(() => {
    setTransactionFormValues({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ? parseFloat(defaultValues?.amount) : null,
      description: defaultValues?.description ?? null,
    });
  }, [defaultValues, today]);

  const [transactionFormValues, setTransactionFormValues] =
    useState<TransactionValues>({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ? parseFloat(defaultValues?.amount) : null,
      description: defaultValues?.description ?? null,
    });

  const handleSubmit = () => {
    if (isNil(transactionFormValues.amount)) {
      return toast.warn('Type an amount.');
    }

    if (transactionFormValues.amount === 0) {
      return toast.warn('Type an amount greater than $0.');
    }

    if (!selectedCategoryId) {
      return toast.warn('Select a category.');
    }

    propsHandleSubmit({
      ...transactionFormValues,
      amount: String(transactionFormValues.amount),
      categoryId: selectedCategoryId,
    })?.then(() => {
      setTransactionFormValues({
        amount: null,
        date: today,
        description: null,
      });
      // handleSelectCategoryId(null);
      handleClearSpendingGroups();
      handleClose();
      spendingGroupsShownState.setFalse();
    });
  };

  const handleDeleteTransaction = () => {
    handleDelete?.()?.then(() => {
      // handleSelectCategoryId(null);
      setTransactionFormValues({
        date: today,
        amount: null,
        description: null,
      });
      handleClose();
    });
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <DialogOverlay />

        <DialogContent>
          <DialogHeader handleClose={handleClose} title={title} />

          <DialogScrollableContent>
            <div className="mb-4 flex flex-col">
              <label htmlFor="amount">Amount</label>

              <DollarInput
                initialFocus
                name="amount"
                value={transactionFormValues.amount}
                handleValueChange={(value) =>
                  setTransactionFormValues((prevValues) => ({
                    ...prevValues,
                    amount: value,
                  }))
                }
              />
            </div>

            {children}

            <div className="mb-4 flex gap-2">
              <label htmlFor="addToSpendingGroup">Add to spending group</label>

              <div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    name="addToSpendingGroup"
                    checked={spendingGroupsShownState.value}
                    onChange={spendingGroupsShownState.toggle}
                  />

                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-main-blue peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full" />
                </label>
              </div>
            </div>

            {spendingGroupsShownState.value && (
              <div className="mb-4 flex min-h-[88px] flex-grow flex-col gap-2 overflow-y-hidden sm:min-h-[36px]">
                <div className="flex flex-col items-start gap-4 overflow-y-hidden">
                  <div className="grid h-full w-full grid-cols-3 gap-4 overflow-y-auto sm:grid-cols-9">
                    {spendingGroups?.map((group) => {
                      const isSelected = selectedSpendingGroupIds.includes(
                        group.id,
                      );

                      return (
                        <button
                          onClick={() => handleSelectSpendingGroupId(group.id)}
                          key={group.id}
                          type="button"
                          className={twMerge(
                            'group flex flex-col items-center gap-2 rounded-2xl bg-white p-2',
                            !isSelected &&
                              'group-hover:bg-main-blue group-hover:text-white',
                            isSelected && 'bg-main-dark text-white',
                          )}
                        >
                          <span
                            className={twMerge(
                              'w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                              isSelected && 'font-medium',
                            )}
                          >
                            {group.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="date">Date</label>
                <Input
                  name="date"
                  type="date"
                  value={transactionFormValues.date}
                  onChange={(e) => {
                    setTransactionFormValues((prevValues) => ({
                      ...prevValues,
                      date: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="description">Description</label>
                <Input
                  onChange={(e) => {
                    setTransactionFormValues((prevValues) => ({
                      ...prevValues,
                      description: e.target.value,
                    }));
                  }}
                  value={transactionFormValues.description ?? ''}
                  name="description"
                />
              </div>
            </div>
          </DialogScrollableContent>

          <DialogActions>
            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-lg text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue sm:text-sm"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>

            {handleDelete && (
              <button
                onClick={handleDeleteTransaction}
                className="block w-full rounded-full bg-white px-3.5 py-2.5 text-lg text-main-orange shadow-sm hover:bg-main-dark/10 sm:text-sm"
              >
                Delete
              </button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};

ManageTransactionModal.Categories = ManageTransactionModalCategories;
