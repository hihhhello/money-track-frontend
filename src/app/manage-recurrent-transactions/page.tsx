'use client';

import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { ChevronDownIcon } from '@/shared/ui/Icons/ChevronDownIcon';
import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { Disclosure } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

const ManageRecurrentTransactionsPage = () => {
  const { data: recurrentTransactions, refetch: refetchRecurrentTransactions } =
    useQuery({
      queryFn: api.recurrentTransactions.getAll,
      queryKey: ['api.recurrentTransactions.getAll'],
    });

  const recurrentTransactionsByDate:
    | {
        [date: string]: {
          transactions: RecurrentTransaction[];
          totalAmount: number;
        };
      }
    | undefined = recurrentTransactions?.reduce(
    (transactionsByDateAccumulator, transaction) => {
      const key = transaction.next_transaction ?? 'None';

      if (!transactionsByDateAccumulator[key]) {
        return {
          ...transactionsByDateAccumulator,
          [key]: {
            transactions: [transaction],
            totalAmount:
              transaction.type === FinancialOperationType.DEPOSIT
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
            transaction.type === FinancialOperationType.DEPOSIT
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

  return (
    <div>
      <h1>Recurrent transactions</h1>

      <div className="flex gap-4">
        <button className="rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add recurrent deposit
        </button>

        <button className="rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add recurrent expense
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {recurrentTransactionsByDate &&
          Object.entries(recurrentTransactionsByDate).map(
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

                <Disclosure.Panel className="flex flex-col pr-2">
                  {transactions.map((transaction) => (
                    <button
                      onClick={() => {
                        // setSelectedTransaction(transaction);
                        // handleOpenManageTransactionModal();
                      }}
                      key={transaction.id}
                      className="flex items-center justify-between py-2 pl-10  pr-2 hover:bg-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={classNames(
                            'h-2 w-2 rounded-full ring',
                            transaction.type === FinancialOperationType.EXPENSE
                              ? 'bg-red-600 ring-red-200'
                              : 'bg-green-600 ring-green-200',
                          )}
                        >
                          <span className="sr-only">
                            Transaction type: {transaction.type}
                          </span>
                        </div>

                        <div className="flex flex-col justify-start">
                          <span className="text-left">
                            {transaction.category.name}
                          </span>

                          <p className="text-sm">{transaction.description}</p>
                        </div>
                      </div>

                      <div>
                        <span>
                          {formatToUSDCurrency(parseFloat(transaction.amount))}
                        </span>
                      </div>
                    </button>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
            ),
          )}
      </div>
    </div>
  );
};

export default ManageRecurrentTransactionsPage;
