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
import { AddNewDepositModal } from '@/features/AddNewDepositModal';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const loadingToast = useLoadingToast();

  const {
    value: isAddNewExpenseModalOpen,
    setTrue: handleOpenAddNewExpenseModal,
    setFalse: handleCloseAddNewExpenseModal,
  } = useBoolean(false);

  const {
    value: isAddNewDepositModalOpen,
    setTrue: handleOpenAddNewDepositModal,
    setFalse: handleCloseAddNewDepositModal,
  } = useBoolean(false);

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  const totalTransactionsAmount = transactions
    ? transactions.reduce((totalExpensesAccumulator, transaction) => {
        if (transaction.type === 'deposit') {
          return totalExpensesAccumulator + parseFloat(transaction.amount);
        }

        return totalExpensesAccumulator - parseFloat(transaction.amount);
      }, 0)
    : 0;

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

  const handleEditTransaction = (transactionId: number) => {
    router.push(`/edit-transaction/${transactionId}`);
  };

  return (
    <div>
      <div>
        <div
          className={classNames(
            'mb-4 flex items-center justify-center rounded-md py-8 shadow',
            totalTransactionsAmount === 0
              ? 'bg-gray-200'
              : totalTransactionsAmount > 0
              ? 'bg-green-600'
              : 'bg-red-600',
          )}
        >
          <span className="text-4xl text-white">
            {formatToUSDCurrency(totalTransactionsAmount)}
          </span>
        </div>

        <div className="flex w-full gap-4">
          <button
            onClick={handleOpenAddNewDepositModal}
            className="flex flex-1 items-center justify-center rounded-md border-[6px] border-sky-600 py-4 hover:border-sky-700"
          >
            <PlusIcon className="h-16 w-16 text-sky-600" />
          </button>

          <button
            onClick={handleOpenAddNewExpenseModal}
            className="flex flex-1 items-center justify-center rounded-md border-[6px] border-red-600 py-4 hover:border-red-700"
          >
            <MinusIcon className="h-16 w-16 text-red-600" />
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
                  <tr
                    key={transaction.id}
                    onClick={() => handleEditTransaction(transaction.id)}
                    className="cursor-pointer bg-white hover:bg-gray-100"
                  >
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
                        ? format(parseISO(transaction.date), 'EEEE, dd MMMM')
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

      <AddNewDepositModal
        handleClose={handleCloseAddNewDepositModal}
        isModalOpen={isAddNewDepositModalOpen}
      />

      <AddNewExpenseModal
        handleClose={handleCloseAddNewExpenseModal}
        isModalOpen={isAddNewExpenseModalOpen}
      />
    </div>
  );
};

export default HomePage;
