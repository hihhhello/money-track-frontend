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
        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Last transactions</span>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
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
                      'whitespace-nowrap',
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

        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Recurrent transactions</span>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {recurrentTransactions.map((transaction) => (
              <div
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
                      {format(
                        parseISO(transaction.next_transaction),
                        'EEEE, dd MMMM',
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={classNames(
                      'whitespace-nowrap',
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
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditTransactionModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={() => {
          handleCloseEditTransactionModal();
        }}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};
