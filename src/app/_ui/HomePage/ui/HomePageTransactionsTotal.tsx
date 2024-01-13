'use client';

import { useQuery } from '@tanstack/react-query';

import {
  classNames,
  formatToUSDCurrency,
  getNetAmount,
} from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { Transaction } from '@/shared/types/transactionTypes';

type HomePageTransactionsTotalProps = {
  transactions: Transaction[];
};

export const HomePageTransactionsTotal = ({
  transactions: initialTransactions,
}: HomePageTransactionsTotalProps) => {
  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
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
      <div>
        <div className="inline-block rounded-full border border-main-white px-6 py-2">
          <span className="text-main-white">Current Expenses</span>
        </div>
      </div>

      <span className="break-words text-3xl leading-relaxed text-white sm:text-6xl">
        {formatToUSDCurrency(Math.abs(totalTransactionsAmount))}
      </span>
    </div>
  );
};
