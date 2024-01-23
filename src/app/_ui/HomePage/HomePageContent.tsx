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
import { getNetAmount } from '@/shared/utils/helpers';
import { FinancialOperationType } from '@/shared/types/globalTypes';

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

  const transactionsByCategory = transactions.reduce<TransactionsByCategory>(
    (acc, transaction) => {
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
    },
    {},
  );

  if (isDesktop) {
    return (
      <HomePageContentDesktop
        recurrentTransactions={recurrentTransactions}
        transactions={transactions}
        filter={transactionsFilter}
        handleChangeFilter={setTransactionsFilter}
        transactionsByCategory={transactionsByCategory}
      />
    );
  }

  return (
    <HomePageContentMobile
      recurrentTransactions={recurrentTransactions}
      transactions={transactions}
      filter={transactionsFilter}
      handleChangeFilter={setTransactionsFilter}
    />
  );
};
