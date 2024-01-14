'use client';

import { Breakpoints, useIsBreakpoint } from '@/shared/utils/hooks';
import {
  Transaction,
  APITransactionPeriodFilter,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { HomePageContentDesktop } from './ui/HomePageContentDesktop';
import { HomePageContentMobile } from './ui/HomePageContentMobile';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';

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

  if (isDesktop) {
    return (
      <HomePageContentDesktop
        recurrentTransactions={recurrentTransactions}
        transactions={transactions}
        filter={transactionsFilter}
        handleChangeFilter={setTransactionsFilter}
      />
    );
  }

  return (
    <HomePageContentMobile
      recurrentTransactions={recurrentTransactions}
      transactions={transactions}
    />
  );
};
