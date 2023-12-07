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
    <div
      className={classNames(
        'mb-4 flex items-center justify-center rounded-md py-8 shadow',
        totalTransactionsAmount === 0
          ? 'bg-gray-200'
          : totalTransactionsAmount > 0
            ? 'bg-green-600'
            : 'bg-red-600',
      )}
    >
      <span className="text-4xl text-white">
        {formatToUSDCurrency(totalTransactionsAmount)}
      </span>
    </div>
  );
};
