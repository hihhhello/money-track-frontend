'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { formatISO, isAfter, parseISO } from 'date-fns';
import { isNil, upperFirst } from 'lodash';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import {
  RecurrentTransactionFrequency,
  RecurrentTransactionFrequencyValue,
} from '../shared/types/recurrentTransactionTypes';
import { DialogActions } from '../shared/ui/Dialog/DialogActions';
import { DialogContent } from '../shared/ui/Dialog/DialogContent';
import { DialogHeader } from '../shared/ui/Dialog/DialogHeader';
import { DialogOverlay } from '../shared/ui/Dialog/DialogOverlay';
import { DialogScrollableContent } from '../shared/ui/Dialog/DialogScrollableContent';
import { DollarInput } from '../shared/ui/DollarInput';
import { Input } from '../shared/ui/Input';
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

    console.log('transactionFormValues', transactionFormValues);

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

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <DialogOverlay />

        <DialogContent>
          <DialogHeader handleClose={handleClose} title={title} />

          <DialogScrollableContent className="overflow-hidden">
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

            <div className="flex flex-row flex-grow gap-16 overflow-hidden px-1">
              <div className="flex flex-grow overflow-y-auto">{children}</div>

              <div>
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

                  <div className="flex w-full flex-col gap-2 mb-4">
                    <label htmlFor="date">End date</label>
                    <div className="flex align-center justify-center gap-1 ">
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

                      <button
                        className="text-gray-400 hover-hover:hover:text-gray-600"
                        onClick={() => {
                          setTransactionFormValues((prevValues) => ({
                            ...prevValues,
                            end_date: null,
                          }));
                        }}
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <span>Frequency</span>

                  <div className="mb-2 flex flex-wrap gap-4">
                    {Object.values(RecurrentTransactionFrequency).map(
                      (frequencyValue) => {
                        return (
                          <button
                            key={frequencyValue}
                            type="button"
                            onClick={() =>
                              setTransactionFormValues((prevValues) => ({
                                ...prevValues,
                                frequency: frequencyValue,
                              }))
                            }
                            className={twMerge(
                              'h-full rounded-2xl bg-white px-4 py-2 shadow-sm transition-colors hover:bg-main-dark hover:text-white',
                              transactionFormValues.frequency ===
                                frequencyValue && 'bg-main-blue text-white',
                            )}
                          >
                            {upperFirst(frequencyValue)}
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
          </DialogScrollableContent>

          <DialogActions>
            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-lg text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue sm:text-sm"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};

ManageRecurrentTransactionModal.Categories = ManageTransactionModalCategories;
