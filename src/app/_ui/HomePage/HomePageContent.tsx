'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import {
  classNames,
  formatToUSDCurrency,
  getNetAmount,
} from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { useBoolean } from '@/shared/utils/hooks';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@/shared/icons/ChevronDownIcon';
import { useState } from 'react';
import { Transaction } from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';

type HomePageContentProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
    initialData: initialTransactions,
  });

  const { data: recurrentTransactions } = useQuery({
    queryFn: api.recurrentTransactions.getAll,
    queryKey: ['api.recurrentTransactions.getAll'],
    initialData: initialRecurrentTransactions,
  });

  const transactionsByDate:
    | {
        [date: string]: {
          transactions: Transaction[];
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
            totalAmount: getNetAmount({
              amount: transaction.amount,
              type: transaction.type,
            }),
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
            transactionsByDateAccumulator[key].totalAmount +
            getNetAmount({
              type: transaction.type,
              amount: transaction.amount,
            }),
        },
      };
    },
    {} as {
      [date: string]: {
        transactions: Transaction[];
        totalAmount: number;
      };
    },
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Last transactions</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {transactions.map((transaction) => (
              <button
                onClick={() => {
                  setSelectedTransaction(transaction);
                  handleOpenEditTransactionModal();
                }}
                key={transaction.id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-1 pr-2 hover:bg-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col justify-start">
                    <span className="text-left">
                      {transaction.category.name}
                    </span>

                    <p className="text-left text-sm">
                      {transaction.description}
                    </p>

                    <p className="text-left text-sm">
                      {format(parseISO(transaction.date), 'EEEE, dd MMMM')}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={classNames(
                      transaction.type === FinancialOperationType.EXPENSE
                        ? 'text-main-orange'
                        : 'text-main-blue',
                    )}
                  >
                    {formatToUSDCurrency(
                      getNetAmount({
                        amount: transaction.amount,
                        type: transaction.type,
                      }),
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span>Recurrent transactions:</span>

          <div className="flex flex-col gap-2">
            {recurrentTransactions?.map((transaction) => (
              <div key={transaction.id} className="px-2 py-2">
                <span>
                  {format(
                    parseISO(transaction.next_transaction),
                    'EEEE, dd MMMM',
                  )}
                </span>

                <div className="flex items-center justify-between pl-4">
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

                  <span>
                    {formatToUSDCurrency(parseFloat(transaction.amount))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditTransactionModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={() => {
          handleCloseEditTransactionModal();
          setSelectedTransaction(null);
        }}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};
