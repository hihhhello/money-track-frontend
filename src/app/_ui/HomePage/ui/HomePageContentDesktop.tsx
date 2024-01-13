'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { useBoolean } from '@/shared/utils/hooks';
import { Transaction } from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';

type HomePageContentDesktopProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContentDesktop = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentDesktopProps) => {
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

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Last payments</span>
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
                className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 hover:bg-gray-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex w-full flex-grow flex-col items-start">
                  <span className="w-full break-words text-left">
                    {transaction.category.name}
                  </span>

                  <p className="w-full break-words text-left text-sm">
                    {transaction.description}
                  </p>

                  <p className="w-full break-words text-left text-sm">
                    {format(parseISO(transaction.date), 'EEEE, dd MMMM')}
                  </p>
                </div>

                <div className="w-full flex-grow">
                  <p
                    className={classNames(
                      'w-full break-words text-left sm:text-right',
                      transaction.type === FinancialOperationType.EXPENSE
                        ? 'text-main-orange'
                        : 'text-main-blue',
                    )}
                  >
                    {formatToUSDCurrency(parseFloat(transaction.amount))}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Upcoming payments</span>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {recurrentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 hover:bg-gray-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex w-full flex-grow flex-col items-start">
                  <span className="w-full break-words text-left">
                    {transaction.category.name}
                  </span>

                  <p className="w-full break-words text-left text-sm">
                    {transaction.description}
                  </p>

                  <p className="w-full break-words text-left text-sm">
                    {format(
                      parseISO(transaction.next_transaction),
                      'EEEE, dd MMMM',
                    )}
                  </p>
                </div>

                <div className="w-full flex-grow">
                  <span
                    className={classNames(
                      'w-full break-words text-left',
                      transaction.type === FinancialOperationType.EXPENSE
                        ? 'text-main-orange'
                        : 'text-main-blue',
                    )}
                  >
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
        }}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};