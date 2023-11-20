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
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@/shared/ui/Icons/ChevronDownIcon';

const HomePage = () => {
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

  const transactionsByDate:
    | {
        [date: string]: {
          transactions: Array<{
            amount: string;
            category_name: number;
            date: string | null;
            id: number;
            timestamp: string;
            type: 'expense' | 'deposit';
            user_id: number;
          }>;
          totalAmount: number;
        };
      }
    | undefined = transactions?.reduce(
    (transactionsByDateAccumulator, transaction) => {
      const key = transaction.date ?? 'None';

      if (!transactionsByDateAccumulator[key]) {
        return {
          ...transactionsByDateAccumulator,
          [key]: {
            transactions: [transaction],
            totalAmount:
              transaction.type === 'deposit'
                ? parseFloat(transaction.amount)
                : -parseFloat(transaction.amount),
          },
        };
      }

      return {
        ...transactionsByDateAccumulator,
        [key]: {
          transactions: [
            ...transactionsByDateAccumulator[key].transactions,
            transaction,
          ],
          totalAmount:
            transaction.type === 'deposit'
              ? transactionsByDateAccumulator[key].totalAmount +
                parseFloat(transaction.amount)
              : transactionsByDateAccumulator[key].totalAmount -
                parseFloat(transaction.amount),
        },
      };
    },
    {} as {
      [date: string]: {
        transactions: any[];
        totalAmount: number;
      };
    },
  );

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

  return (
    <div>
      <div className="mb-4">
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

      <div className="flex flex-col gap-4 px-4">
        {transactionsByDate &&
          Object.entries(transactionsByDate).map(
            ([date, { transactions, totalAmount }]) => (
              <Disclosure key={date}>
                <Disclosure.Button className="flex justify-between pr-4">
                  {({ open }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronDownIcon
                          className={classNames(open && 'rotate-180')}
                        />

                        <span>{format(parseISO(date), 'EEEE, dd MMMM')}</span>

                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                          {transactions.length}
                        </span>
                      </div>

                      <span
                        className={classNames(
                          totalAmount === 0
                            ? ''
                            : totalAmount < 0
                            ? 'text-red-600'
                            : 'text-green-600',
                        )}
                      >
                        {formatToUSDCurrency(totalAmount)}
                      </span>
                    </>
                  )}
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-col gap-4 pl-10 pr-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={classNames(
                            'h-2 w-2 rounded-full ring',
                            transaction.type === 'expense'
                              ? 'bg-red-600 ring-red-200'
                              : 'bg-green-600 ring-green-200',
                          )}
                        >
                          {' '}
                          <span className="sr-only">
                            Transaction type: {transaction.type}
                          </span>
                        </div>

                        <span>{transaction.category_name}</span>
                      </div>

                      <div>
                        <span>
                          {formatToUSDCurrency(parseFloat(transaction.amount))}
                        </span>
                      </div>
                    </div>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
            ),
          )}
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
