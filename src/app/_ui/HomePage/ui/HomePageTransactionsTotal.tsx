'use client';

import { useQuery } from '@tanstack/react-query';

import { formatToUSDCurrency, getNetAmount } from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { useState } from 'react';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';

type HomePageTransactionsTotalProps = {
  transactions: Transaction[];
};

export const HomePageTransactionsTotal = ({
  transactions: initialTransactions,
}: HomePageTransactionsTotalProps) => {
  const [transactionsFilter, setTransactionsFilter] =
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

  const totalTransactionsAmount = transactions
    ? transactions.reduce(
        (totalExpensesAccumulator, transaction) =>
          totalExpensesAccumulator +
          getNetAmount({
            type: transaction.type,
            amount: transaction.amount,
          }),
        0,
      )
    : 0;

  return (
    <div className="flex h-full w-full flex-col justify-end gap-2 rounded-3xl bg-main-dark px-3 pb-5 pt-4">
      <div className="flex items-center justify-between">
        <div className="inline-block rounded-full border border-main-white px-6 py-2">
          <span className="text-main-white">Expenses</span>
        </div>

        <TransactionsPeriodFilterSelect
          filter={transactionsFilter}
          handleChangeFilter={setTransactionsFilter}
        />
      </div>

      <span className="break-words text-3xl leading-relaxed text-white sm:text-6xl">
        {formatToUSDCurrency(Math.abs(totalTransactionsAmount))}
      </span>
    </div>
  );
};
