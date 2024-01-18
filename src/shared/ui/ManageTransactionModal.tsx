'use client';

import { classNames } from '@/shared/utils/helpers';
import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import { formatISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogContent } from './Dialog/DialogContent';
import { CategoryItem } from './Category/CategoryItem';
import { CategoryList } from './Category/CategoryList';
import { Input } from './Input';
import { DialogHeader } from './Dialog/DialogHeader';

type TransactionValues = {
  amount: string;
  date: string;
  description: string | null;
};

type ManageTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  categories: Array<{ id: number; name: string }> | undefined;
  handleSubmit: (
    transactionValues: TransactionValues & {
      categoryId: number;
    },
  ) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultValues?: TransactionValues & {
    categoryId: number;
  };
  handleDelete?: () => Promise<void> | undefined | void;
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
}: ManageTransactionModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    defaultValues?.categoryId ?? null,
  );

  const today = formatISO(new Date(), { representation: 'date' });

  useEffect(() => {
    setSelectedCategoryId(defaultValues?.categoryId ?? null);
    setTransactionFormValues({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ?? '',
      description: defaultValues?.description ?? null,
    });
  }, [defaultValues, today]);

  const [transactionFormValues, setTransactionFormValues] =
    useState<TransactionValues>({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ?? '',
      description: defaultValues?.description ?? null,
    });

  const handleSubmit = () => {
    if (!selectedCategoryId) {
      return toast.warn('Select category.');
    }

    propsHandleSubmit({
      ...transactionFormValues,
      categoryId: selectedCategoryId,
    })?.then(() => {
      setTransactionFormValues({
        amount: '',
        date: today,
        description: null,
      });
      setSelectedCategoryId(null);
      handleClose();
    });
  };

  const handleDeleteTransaction = () => {
    handleDelete?.()?.then(() => {
      setSelectedCategoryId(null);
      setTransactionFormValues({
        date: today,
        amount: '',
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

          <div className="h-full overflow-y-auto p-4">
            <div>
              <div className="mb-4 flex flex-col">
                <label htmlFor="amount">Amount</label>
                <Input
                  type="number"
                  name="amount"
                  value={String(transactionFormValues.amount)}
                  onChange={(e) => {
                    setTransactionFormValues((prevValues) => ({
                      ...prevValues,
                      amount: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="mb-4 flex flex-col gap-2">
                <span>Category</span>

                <CategoryList className="mb-2 p-2">
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
            </div>
          </div>

          <div className="z-10 flex gap-4 p-4">
            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>

            {handleDelete && (
              <button
                onClick={handleDeleteTransaction}
                className="block w-full rounded-full bg-white px-3.5 py-2.5 text-sm text-main-orange shadow-sm hover:bg-main-dark/10"
              >
                Delete
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};
