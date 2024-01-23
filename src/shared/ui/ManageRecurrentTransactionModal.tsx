'use client';

import { Fragment, useEffect, useState } from 'react';
import { formatISO, isAfter, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import {
  RecurrentTransactionFrequency,
  RecurrentTransactionFrequencyKey,
  RecurrentTransactionFrequencyValue,
} from '../types/recurrentTransactionTypes';
import { isNil, upperFirst } from 'lodash';
import { twMerge } from 'tailwind-merge';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogContent } from './Dialog/DialogContent';
import { CategoryItem } from './Category/CategoryItem';
import { CategoryList } from './Category/CategoryList';
import { DialogHeader } from './Dialog/DialogHeader';
import { Input } from './Input';
import { DialogActions } from './Dialog/DialogActions';
import { DollarInput } from './DollarInput';
import { DialogScrollableContent } from './Dialog/DialogScrollableContent';
import { CategoryListLoading } from './Category/CategoryListLoading';

type RecurrentTransactionValues = {
  amount: number | null;
  frequency: RecurrentTransactionFrequencyValue;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};

export type ManageRecurrentTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  categories: Array<{ id: number; name: string }> | undefined;
  isCategoriesLoading?: boolean;
  handleSubmit: (
    transactionValues: {
      categoryId: number;
      amount: string;
      frequency: RecurrentTransactionFrequencyValue;
      description: string | null;
      start_date: string | null;
      end_date: string | null;
    },
    options?: { isPastStartDate?: boolean },
  ) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultValues?: {
    amount: string;
    frequency: RecurrentTransactionFrequencyValue;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    categoryId: number;
  };
  handleDelete?: () => Promise<void> | undefined | void;
};

export const ManageRecurrentTransactionModal = ({
  handleClose,
  isModalOpen,
  categories,
  handleSubmit: handleSubmitTransactionValues,
  submitButtonLabel,
  title,
  defaultValues: defaultTransactionValues,
  handleDelete,
  isCategoriesLoading,
}: ManageRecurrentTransactionModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    defaultTransactionValues?.categoryId ?? null,
  );

  const today = formatISO(new Date(), { representation: 'date' });

  const isPastStartDate = defaultTransactionValues?.start_date
    ? isAfter(new Date(), parseISO(defaultTransactionValues.start_date))
    : false;

  useEffect(() => {
    setSelectedCategoryId(defaultTransactionValues?.categoryId ?? null);
    setTransactionFormValues({
      amount: defaultTransactionValues?.amount
        ? parseFloat(defaultTransactionValues?.amount)
        : null,
      description: defaultTransactionValues?.description ?? null,
      end_date: defaultTransactionValues?.end_date ?? null,
      frequency:
        defaultTransactionValues?.frequency ??
        RecurrentTransactionFrequency.MONTHLY,
      start_date: defaultTransactionValues?.start_date ?? today,
    });
  }, [defaultTransactionValues, today]);

  const [transactionFormValues, setTransactionFormValues] =
    useState<RecurrentTransactionValues>({
      amount: defaultTransactionValues?.amount
        ? parseFloat(defaultTransactionValues?.amount)
        : null,
      description: defaultTransactionValues?.description ?? null,
      end_date: defaultTransactionValues?.end_date ?? null,
      frequency:
        defaultTransactionValues?.frequency ??
        RecurrentTransactionFrequency.MONTHLY,
      start_date: defaultTransactionValues?.start_date ?? today,
    });

  const handleSubmit = () => {
    if (isNil(transactionFormValues.amount)) {
      return toast.warn('Type an amount.');
    }

    if (transactionFormValues.amount === 0) {
      return toast.warn('Type an amount greater than $0.');
    }

    if (!selectedCategoryId) {
      return toast.warn('Select category.');
    }

    handleSubmitTransactionValues(
      {
        ...transactionFormValues,
        amount: String(transactionFormValues.amount),
        categoryId: selectedCategoryId,
      },
      { isPastStartDate },
    )?.then(() => {
      setTransactionFormValues({
        amount: null,
        description: null,
        end_date: null,
        start_date: today,
        frequency: RecurrentTransactionFrequency.MONTHLY,
      });
      setSelectedCategoryId(null);
      handleClose();
    });
  };

  const handleDeleteTransaction = () => {
    handleDelete?.()?.then(() => {
      setSelectedCategoryId(null);
      setTransactionFormValues({
        amount: null,
        description: null,
        end_date: null,
        start_date: today,
        frequency: RecurrentTransactionFrequency.MONTHLY,
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
            <div className="mb-4 flex flex-col gap-2">
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

            <div className="mb-4 flex min-h-[200px] flex-grow flex-col gap-2 overflow-y-hidden">
              <span>Category</span>

              {isCategoriesLoading ? (
                <CategoryListLoading />
              ) : (
                <CategoryList
                  className="mb-2 p-2"
                  wrapperClassName="overflow-y-hidden"
                >
                  {categories?.map((category) => (
                    <CategoryItem
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      isSelected={selectedCategoryId === category.id}
                    >
                      {category.name}
                    </CategoryItem>
                  ))}
                </CategoryList>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="mb-4 flex w-full flex-col gap-2">
                <label htmlFor="date">
                  {isPastStartDate ? 'Next date' : 'Start date'}
                </label>

                <Input
                  name="startDate"
                  type="date"
                  value={transactionFormValues.start_date ?? ''}
                  onChange={(e) => {
                    setTransactionFormValues((prevValues) => ({
                      ...prevValues,
                      start_date: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="mb-4 flex w-full flex-col gap-2">
                <label htmlFor="date">End date</label>
                <Input
                  name="endDate"
                  type="date"
                  value={transactionFormValues.end_date ?? ''}
                  onChange={(e) => {
                    setTransactionFormValues((prevValues) => ({
                      ...prevValues,
                      end_date: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <span>Frequency</span>

              <div className="mb-2 flex flex-wrap gap-4">
                {Object.keys(RecurrentTransactionFrequency).map(
                  (frequencyKey) => {
                    const frequency =
                      RecurrentTransactionFrequency[
                        frequencyKey as RecurrentTransactionFrequencyKey
                      ];

                    return (
                      <button
                        key={frequencyKey}
                        type="button"
                        onClick={() =>
                          setTransactionFormValues((prevValues) => ({
                            ...prevValues,
                            frequency,
                          }))
                        }
                        className={twMerge(
                          'h-full rounded-2xl bg-white px-4 py-2 shadow-sm transition-colors hover:bg-main-dark hover:text-white',
                          transactionFormValues.frequency === frequency &&
                            'bg-main-blue text-white',
                        )}
                      >
                        {upperFirst(frequency)}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="note">Note</label>
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
