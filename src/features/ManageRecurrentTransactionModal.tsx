'use client';

import { Fragment, ReactNode, useEffect, useState } from 'react';
import { formatISO, isAfter, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import {
  RecurrentTransactionFrequency,
  RecurrentTransactionFrequencyKey,
  RecurrentTransactionFrequencyValue,
} from '../shared/types/recurrentTransactionTypes';
import { isNil, upperFirst } from 'lodash';
import { twMerge } from 'tailwind-merge';
import { DialogOverlay } from '../shared/ui/Dialog/DialogOverlay';
import { DialogContent } from '../shared/ui/Dialog/DialogContent';
import { CategoryItem } from '../shared/ui/Category/CategoryItem';
import { CategoryList } from '../shared/ui/Category/CategoryList';
import { DialogHeader } from '../shared/ui/Dialog/DialogHeader';
import { Input } from '../shared/ui/Input';
import { DialogActions } from '../shared/ui/Dialog/DialogActions';
import { DollarInput } from '../shared/ui/DollarInput';
import { DialogScrollableContent } from '../shared/ui/Dialog/DialogScrollableContent';
import { CategoryListLoading } from '../shared/ui/Category/CategoryListLoading';
import { ManageTransactionModalCategories } from './ManageTransactionModal/components/ManageTransactionModalCategories';

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
    next_date: string | null;
    end_date: string | null;
    categoryId: number;
  };
  handleDelete?: () => Promise<void> | undefined | void;
  children?: ReactNode;
  selectedCategoryId: number | null;
};

export const ManageRecurrentTransactionModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: handleSubmitTransactionValues,
  submitButtonLabel,
  title,
  defaultValues: defaultTransactionValues,
  handleDelete,
  children,
  selectedCategoryId,
}: ManageRecurrentTransactionModalProps) => {
  const today = formatISO(new Date(), { representation: 'date' });

  const isPastStartDate = defaultTransactionValues?.start_date
    ? isAfter(new Date(), parseISO(defaultTransactionValues.start_date))
    : false;

  useEffect(() => {
    setTransactionFormValues({
      amount: defaultTransactionValues?.amount
        ? parseFloat(defaultTransactionValues?.amount)
        : null,
      description: defaultTransactionValues?.description ?? null,
      end_date: defaultTransactionValues?.end_date ?? null,
      frequency:
        defaultTransactionValues?.frequency ??
        RecurrentTransactionFrequency.MONTHLY,
      start_date:
        (isPastStartDate
          ? defaultTransactionValues?.next_date
          : defaultTransactionValues?.start_date) ?? today,
    });
  }, [defaultTransactionValues, isPastStartDate, today]);

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
      start_date:
        (isPastStartDate
          ? defaultTransactionValues?.next_date
          : defaultTransactionValues?.start_date) ?? today,
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
      handleClose();
    });
  };

  const handleDeleteTransaction = () => {
    handleDelete?.()?.then(() => {
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

            {children}

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

ManageRecurrentTransactionModal.Categories = ManageTransactionModalCategories;
