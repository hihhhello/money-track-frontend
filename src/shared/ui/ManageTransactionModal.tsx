'use client';

import { classNames } from '@/shared/utils/helpers';
import { FormEvent, Fragment, useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/ui/icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';

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

                    <div className="mb-2 flex flex-wrap gap-4">
                      {categories?.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(category.id)}
                          className={classNames(
                            'h-full border border-gray-200 px-4 py-2 font-semibold shadow-sm',
                            selectedCategoryId === category.id && 'bg-gray-100',
                          )}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="date">Date</label>
                    <input
                      className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
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

                  <div className="flex flex-col">
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
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
