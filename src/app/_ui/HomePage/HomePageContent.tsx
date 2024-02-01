'use client';

import { Breakpoints, useIsBreakpoint } from '@/shared/utils/hooks';
import {
  Transaction,
  APITransactionPeriodFilter,
  TransactionPeriodFilter,
  TransactionsByCategory,
} from '@/shared/types/transactionTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { HomePageContentDesktop } from './ui/HomePageContentDesktop';
import { HomePageContentMobile } from './ui/HomePageContentMobile';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { HomePageAddNewTransactionActions } from './ui/HomePageAddNewTransactionActions';
import { HomePageTransactionsTotal } from './ui/HomePageTransactionsTotal';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';

type HomePageContentProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const isDesktop = useIsBreakpoint(Breakpoints.MD);

  const [transactionsFilter, setTransactionsFilter] =
    useState<TransactionPeriodFilter>('month');
  const [recurrentTransactionsFilter, setRecurrentTransactionsFilter] =
    useState<TransactionPeriodFilter>('month');

  const { data: transactions } = useQuery({
    queryFn: ({ queryKey }) => {
      const filter = queryKey[1] as typeof transactionsFilter;

      return api.transactions.getAll({
        searchParams: {
          period: filter === 'all' ? undefined : filter,
        },
      });
    },
    queryKey: ['api.transactions.getAll', transactionsFilter],
    initialData: initialTransactions,
  });

  const { data: recurrentTransactions } = useQuery({
    queryFn: api.recurrentTransactions.getAll,
    queryKey: ['api.recurrentTransactions.getAll'],
    initialData: initialRecurrentTransactions,
  });

  const transactionsByCategory = Object.fromEntries(
    Object.entries(
      transactions.reduce<TransactionsByCategory>((acc, transaction) => {
        const category = transaction.category.name;

        const updatedCategoryTransactions = [
          ...(acc[category]?.transactions ?? []),
          transaction,
        ];

        const updatedTotalAmount =
          (acc[category]?.totalAmount ?? 0) - parseFloat(transaction.amount);

        return {
          ...acc,
          [category]: {
            transactions: updatedCategoryTransactions,
            totalAmount: updatedTotalAmount,
            type:
              updatedTotalAmount >= 0
                ? FinancialOperationType.DEPOSIT
                : FinancialOperationType.EXPENSE,
          },
        };
      }, {}),
    ).sort(([, a], [, b]) => a.totalAmount - b.totalAmount),
  );

  if (isDesktop) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mb-4">
          <TransactionsPeriodFilterSelect
            filter={transactionsFilter}
            handleChangeFilter={setTransactionsFilter}
          />
        </div>

        <div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <HomePageTransactionsTotal transactions={transactions} />
          </div>

          <div className="sm:col-span-2">
            <HomePageAddNewTransactionActions />
          </div>
        </div>

        <HomePageContentDesktop
          recurrentTransactions={recurrentTransactions}
          transactions={transactions}
          transactionsByCategory={transactionsByCategory}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4">
        <TransactionsPeriodFilterSelect
          filter={transactionsFilter}
          handleChangeFilter={setTransactionsFilter}
        />
      </div>

      <div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <HomePageTransactionsTotal transactions={transactions} />
        </div>

        <div className="sm:col-span-2">
          <HomePageAddNewTransactionActions />
        </div>
      </div>

      <HomePageContentMobile
        recurrentTransactions={recurrentTransactions}
        transactions={transactions}
        transactionsByCategory={transactionsByCategory}
      />
    </div>
  );
};
