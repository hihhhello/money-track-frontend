'use client';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { classNames } from '@/shared/utils/helpers';
import { FormEvent, Fragment, useState } from 'react';
import { formatISO } from 'date-fns';
import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/ui/Icons/XMarkIcon';

type AddNewExpenseModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
};

export const AddNewExpenseModal = ({
  handleClose,
  isModalOpen,
}: AddNewExpenseModalProps) => {
  const queryClient = useQueryClient();

  const loadingToast = useLoadingToast();

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: 'expense',
        },
      }),
    queryKey: ['api.categories.getAll'],
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const today = formatISO(new Date(), { representation: 'date' });

  const [newTransactionFormValues, setNewTransactionFormValues] = useState<{
    amount: string;
    date: string;
  }>({
    date: today,
    amount: '',
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      return toast.warn('Select category.');
    }

    const toastId = loadingToast.showLoading('Adding new transaction...');

    api.transactions
      .createOne({
        body: {
          ...newTransactionFormValues,
          category_id: selectedCategoryId,
          type: 'expense',
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        loadingToast.handleSuccess({
          message: 'New expense has been added.',
          toastId,
        });

        setNewTransactionFormValues({
          amount: '',
          date: today,
        });
        handleClose();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName) {
      return toast.warn('Category name is required.');
    }

    const toastId = loadingToast.showLoading('Adding new category...');

    api.categories
      .createOne({
        body: {
          name: newCategoryName,
        },
      })
      .then((newCategory) => {
        refetchCategories();

        loadingToast.handleSuccess({
          message: 'New category has been added.',
          toastId,
        });

        setSelectedCategoryId(newCategory.id);
        setNewCategoryName('');
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
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
            <Dialog.Panel className="relative h-full w-full bg-white p-4 pb-20 sm:h-auto sm:max-w-sm sm:rounded">
              <div className="flex justify-end">
                <button onClick={handleClose}>
                  <XMarkIcon />
                </button>
              </div>

              <Dialog.Title
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900"
              >
                Add new expense
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col">
                  <label htmlFor="amount">Amount</label>
                  <input
                    className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
                    type="number"
                    name="amount"
                    value={String(newTransactionFormValues.amount)}
                    onChange={(e) => {
                      setNewTransactionFormValues((prevValues) => ({
                        ...prevValues,
                        amount: e.target.value,
                      }));
                    }}
                  />
                </div>

                <div className="mb-4">
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

                  <div className="flex items-center gap-2">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      name="newCategoryName"
                      id="newCategoryName"
                      placeholder="New Category"
                      className="focus:ring-primary-green rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
                    />

                    <button
                      onClick={handleAddNewCategory}
                      type="button"
                      className="rounded-md bg-indigo-600"
                    >
                      <PlusIcon className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="date">Date</label>
                  <input
                    className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
                    name="date"
                    type="date"
                    value={newTransactionFormValues.date}
                    onChange={(e) => {
                      setNewTransactionFormValues((prevValues) => ({
                        ...prevValues,
                        date: e.target.value,
                      }));
                    }}
                  />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
