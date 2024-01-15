'use client';

import { classNames } from '@/shared/utils/helpers';
import { FormEvent, Fragment, useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/icons/XMarkIcon';
import { TrashIcon } from '../icons/TrashIcon';
import {
  RecurrentTransactionFrequency,
  RecurrentTransactionFrequencyKey,
  RecurrentTransactionFrequencyValue,
} from '../types/recurrentTransactionTypes';
import { upperFirst } from 'lodash';
import { twMerge } from 'tailwind-merge';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogContent } from './Dialog/DialogContent';
import { CategoryItem } from './Category/CategoryItem';
import { CategoryList } from './Category/CategoryList';
import { DialogHeader } from './Dialog/DialogHeader';
import { Input } from './Input';

type RecurrentTransactionValues = {
  amount: string;
  frequency: RecurrentTransactionFrequencyValue;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};

export type ManageRecurrentTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  categories: Array<{ id: number; name: string }> | undefined;
  handleSubmit: (
    transactionValues: RecurrentTransactionValues & {
      categoryId: number;
    },
  ) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultValues?: RecurrentTransactionValues & {
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
}: ManageRecurrentTransactionModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    defaultTransactionValues?.categoryId ?? null,
  );

  const today = formatISO(new Date(), { representation: 'date' });

  useEffect(() => {
    setSelectedCategoryId(defaultTransactionValues?.categoryId ?? null);
    setTransactionFormValues({
      amount: defaultTransactionValues?.amount ?? '',
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
      amount: defaultTransactionValues?.amount ?? '',
      description: defaultTransactionValues?.description ?? null,
      end_date: defaultTransactionValues?.end_date ?? null,
      frequency:
        defaultTransactionValues?.frequency ??
        RecurrentTransactionFrequency.MONTHLY,
      start_date: defaultTransactionValues?.start_date ?? today,
    });

  const handleSubmit = () => {
    if (!selectedCategoryId) {
      return toast.warn('Select category.');
    }

    handleSubmitTransactionValues({
      ...transactionFormValues,
      categoryId: selectedCategoryId,
    })?.then(() => {
      setTransactionFormValues({
        amount: '',
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
        amount: '',
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

          <div className="h-full overflow-y-auto p-4">
            <div>
              <div className="mb-4 flex flex-col gap-2">
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

                <CategoryList>
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

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="mb-4 flex w-full flex-col gap-2">
                  <label htmlFor="date">Start date</label>

                  <Input
                    name="date"
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
                    name="date"
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
