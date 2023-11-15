'use client';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { FormEvent, Fragment, useState } from 'react';
import { format, formatISO, parseISO } from 'date-fns';
import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { toast } from 'react-toastify';
import { MinusIcon } from '@/shared/ui/Icons/MinusIcon';
import { TrashIcon } from '@/shared/ui/Icons/TrashIcon';
import { Dialog, Transition } from '@headlessui/react';

type AddNewExpenseModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
};

const AddNewExpenseModal = ({
  handleClose,
  isModalOpen,
}: AddNewExpenseModalProps) => {
  const queryClient = useQueryClient();

  const loadingToast = useLoadingToast();

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [newTransactionFormValues, setNewTransactionFormValues] = useState<{
    amount: string;
    date: string;
  }>({
    date: formatISO(new Date(), { representation: 'date' }),
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
          category: selectedCategoryId,
          type: 'expense',
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        loadingToast.handleSuccess({
          message: 'New transaction has been added.',
          toastId,
        });
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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm rounded bg-white p-4">
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

                <button
                  type="submit"
                  className="mt-4 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add
                </button>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const HomePage = () => {
  const {
    value: isAddNewExpenseModalOpen,
    setTrue: handleOpenAddNewExpenseModal,
    setFalse: handleCloseAddNewExpenseModal,
  } = useBoolean(false);

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  const totalExpensesAmount = transactions?.reduce(
    (totalExpensesAccumulator, transaction) =>
      totalExpensesAccumulator + parseFloat(transaction.amount),
    0,
  );

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-center rounded-md bg-gray-200 py-8">
          <span className="text-4xl">
            {formatToUSDCurrency(totalExpensesAmount)}
          </span>
        </div>

        <div className="flex w-full gap-4">
          <button className="flex flex-1 items-center justify-center rounded-md bg-sky-600 py-4 hover:bg-sky-700">
            <PlusIcon className="h-10 w-10 text-white" />
          </button>

          <button
            onClick={handleOpenAddNewExpenseModal}
            className="flex flex-1 items-center justify-center rounded-md bg-red-600 py-4 hover:bg-red-700"
          >
            <MinusIcon className="h-10 w-10 text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <table className="relative min-w-full border-separate border-spacing-y-2 divide-y divide-gray-300">
          <thead className="bg-primary-background sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="text-text-dark px-3 py-3.5 text-left text-sm font-semibold"
              >
                ID
              </th>

              <th
                scope="col"
                className="text-text-dark focus-primary cursor-pointer px-3 py-3.5 text-left text-sm font-semibold"
                tabIndex={0}
              >
                <div className="flex items-center">Date</div>
              </th>

              <th
                scope="col"
                className="text-text-dark focus-primary cursor-pointer px-3 py-3.5 text-left text-sm font-semibold"
              >
                <div className="flex items-center">Amount</div>
              </th>

              <th
                scope="col"
                className="text-text-dark px-3 py-3.5 text-left text-sm font-semibold"
              >
                Type
              </th>

              <th
                scope="col"
                className="text-text-dark px-3 py-3.5 text-left text-sm font-semibold"
              >
                Category
              </th>

              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-sm font-semibold"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions?.map((transaction) => {
              return (
                <tr key={transaction.id} className="bg-white">
                  <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                    {transaction.id}
                  </td>

                  <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                    {transaction.date
                      ? format(parseISO(transaction.date), 'MM-dd-yyyy')
                      : '--'}
                  </td>

                  <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                    {formatToUSDCurrency(parseFloat(transaction.amount))}
                  </td>

                  <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                    {transaction.type}
                  </td>

                  <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                    {transaction.category}
                  </td>

                  <td className="text-text-regular whitespace-nowrap rounded-r-md px-3 py-2 pr-4 text-sm">
                    <div className="flex justify-center gap-2">
                      <button>
                        <TrashIcon className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddNewExpenseModal
        handleClose={handleCloseAddNewExpenseModal}
        isModalOpen={isAddNewExpenseModalOpen}
      />
    </div>
  );
};

export default HomePage;
