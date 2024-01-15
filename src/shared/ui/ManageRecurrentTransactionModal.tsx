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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-black/30 sm:block" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative flex h-full w-full flex-col bg-white sm:max-h-[550px] sm:max-w-5xl sm:rounded">
              <div className="z-10 border-b-2 p-4">
                <div
                  className={classNames(
                    'flex',
                    handleDelete ? 'justify-between' : 'justify-end',
                  )}
                >
                  {handleDelete && (
                    <button onClick={handleDeleteTransaction}>
                      <TrashIcon className="text-red-600 hover:text-red-500" />
                    </button>
                  )}

                  <button onClick={handleClose}>
                    <XMarkIcon />
                  </button>
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
              </div>

              <div className="h-full overflow-y-auto p-4">
                <div>
                  <div className="mb-4 flex flex-col">
                    <label htmlFor="amount">Amount</label>
                    <input
                      className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
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

                  <div className="mb-4">
                    <span>Category</span>

                    <div className="mb-2 flex max-h-40 flex-wrap gap-4 overflow-y-auto p-2 sm:max-h-24">
                      {categories?.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(category.id)}
                          className={twMerge(
                            'h-full rounded-3xl bg-white px-4 py-2 shadow-md transition-colors hover:bg-main-dark hover:text-white',
                            selectedCategoryId === category.id &&
                              'bg-main-blue text-main-white',
                          )}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="mb-4 flex w-full flex-col">
                      <label htmlFor="date">Start date</label>
                      <input
                        className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
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

                    <div className="mb-4 flex w-full flex-col">
                      <label htmlFor="date">End date</label>
                      <input
                        className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
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

                  <div className="mb-4 flex flex-col">
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
                              className={classNames(
                                'h-full border border-gray-200 px-4 py-2 font-semibold shadow-sm',
                                transactionFormValues.frequency === frequency &&
                                  'bg-gray-100',
                              )}
                            >
                              {upperFirst(frequency)}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex flex-col">
                    <label htmlFor="note">Note</label>
                    <textarea
                      onChange={(e) => {
                        setTransactionFormValues((prevValues) => ({
                          ...prevValues,
                          description: e.target.value,
                        }));
                      }}
                      value={transactionFormValues.description ?? ''}
                      className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
                      name="description"
                      placeholder="Add description"
                    />
                  </div>
                </div>
              </div>

              <div className="z-10 border-t-2  p-4">
                <button
                  onClick={handleSubmit}
                  className="block w-full rounded-md bg-main-blue px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
                >
                  {submitButtonLabel ?? 'Submit'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
