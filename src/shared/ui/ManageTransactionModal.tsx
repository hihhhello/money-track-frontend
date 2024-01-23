'use client';

import { Fragment, ReactNode, useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogContent } from './Dialog/DialogContent';
import { CategoryItem } from './Category/CategoryItem';
import { CategoryList } from './Category/CategoryList';
import { Input } from './Input';
import { DialogHeader } from './Dialog/DialogHeader';
import { DollarInput } from './DollarInput';
import { isNil } from 'lodash';
import { DialogActions } from './Dialog/DialogActions';
import { DialogScrollableContent } from './Dialog/DialogScrollableContent';
import { CategoryListLoading } from './Category/CategoryListLoading';

type TransactionValues = {
  amount: number | null;
  date: string;
  description: string | null;
};

type ManageTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  categories: Array<{ id: number; name: string }> | undefined;
  isCategoriesLoading?: boolean;
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
  handleAddNewCategory?: () => void;
  nestedModal?: ReactNode;
  selectedCategoryId: number | null;
  handleSelectCategoryId: (id: number | null) => void;
};

export const ManageTransactionModal = ({
  handleClose,
  isModalOpen,
  categories,
  handleSubmit: propsHandleSubmit,
  submitButtonLabel,
  title,
  defaultValues: defaultValues,
  handleDelete,
  handleAddNewCategory,
  nestedModal,
  handleSelectCategoryId,
  selectedCategoryId,
  isCategoriesLoading,
}: ManageTransactionModalProps) => {
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
      handleSelectCategoryId(null);
      handleClose();
    });
  };

  const handleDeleteTransaction = () => {
    handleDelete?.()?.then(() => {
      handleSelectCategoryId(null);
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

            <div className="mb-4 flex min-h-[200px] flex-col gap-2 overflow-y-hidden">
              <span>Category</span>

              {isCategoriesLoading ? (
                <CategoryListLoading
                  handleAddNewCategory={handleAddNewCategory}
                />
              ) : (
                <CategoryList
                  className="mb-2 p-2"
                  wrapperClassName="overflow-y-hidden"
                  handleAddNewCategory={handleAddNewCategory}
                >
                  {categories?.map((category) => (
                    <CategoryItem
                      key={category.id}
                      onClick={() => handleSelectCategoryId(category.id)}
                      isSelected={selectedCategoryId === category.id}
                    >
                      {category.name}
                    </CategoryItem>
                  ))}
                </CategoryList>
              )}
            </div>

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

        {nestedModal}
      </Dialog>
    </Transition>
  );
};
