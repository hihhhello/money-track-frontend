'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { MinusIcon } from '@/shared/ui/Icons/MinusIcon';
import { TrashIcon } from '@/shared/ui/Icons/TrashIcon';
import { AddNewExpenseModal } from '@/features/AddNewExpenseModal';

const HomePage = () => {
  const loadingToast = useLoadingToast();

  const {
    value: isAddNewExpenseModalOpen,
    setTrue: handleOpenAddNewExpenseModal,
    setFalse: handleCloseAddNewExpenseModal,
  } = useBoolean(false);

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  const totalExpensesAmount = transactions?.reduce(
    (totalExpensesAccumulator, transaction) =>
      totalExpensesAccumulator + parseFloat(transaction.amount),
    0,
  );

  const handleDeleteTransaction = (transactionId: number) => {
    const toastId = loadingToast.showLoading('Deleting transaction...');

    api.transactions
      .deleteOne({
        params: {
          transactionId,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'Transaction has been removed.',
        });
        refetchTransactions();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

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

      <div className="relative max-h-[calc(70vh)] overflow-y-auto">
        <div className="relative">
          <table className="relative min-w-full border-separate border-spacing-y-2 divide-y divide-gray-300">
            <thead className="bg-primary-background sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="text-text-dark px-3 py-3.5 text-left text-sm font-semibold"
                >
                  <span className="sr-only">Transaction type indicator</span>
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
                      <div
                        className={classNames(
                          'h-2 w-2 rounded-full ring',
                          transaction.type === 'expense'
                            ? 'bg-red-600 ring-red-200'
                            : 'bg-green-600 ring-green-200',
                        )}
                      ></div>

                      <span className="sr-only">
                        Transaction type: {transaction.type}
                      </span>
                    </td>

                    <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                      {transaction.date
                        ? format(parseISO(transaction.date), 'dd MMMM yyyy')
                        : '--'}
                    </td>

                    <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                      {formatToUSDCurrency(parseFloat(transaction.amount))}
                    </td>

                    <td className="text-text-regular whitespace-nowrap px-3 py-2 text-sm">
                      {transaction.category_name}
                    </td>

                    <td className="text-text-regular whitespace-nowrap rounded-r-md px-3 py-2 pr-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                        >
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
      </div>

      <AddNewExpenseModal
        handleClose={handleCloseAddNewExpenseModal}
        isModalOpen={isAddNewExpenseModalOpen}
      />
    </div>
  );
};

export default HomePage;
