'use client';

import { Fragment, useState } from 'react';
import { format, parseISO } from 'date-fns';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { useBoolean } from '@/shared/utils/hooks';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';

type HomePageContentDesktopProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
  filter: TransactionPeriodFilter;
  handleChangeFilter: (newFilter: TransactionPeriodFilter) => void;
};

export const HomePageContentDesktop = ({
  recurrentTransactions,
  transactions,
  filter,
  handleChangeFilter,
}: HomePageContentDesktopProps) => {
  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xl text-main-dark">Last payments</span>
            </div>

            <TransactionsPeriodFilterSelect
              filter={filter}
              handleChangeFilter={handleChangeFilter}
            />
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
            <div>
              <span className="text-xl text-main-dark">Upcoming payments</span>
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
