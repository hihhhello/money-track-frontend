'use client';

import { formatUSDDecimal } from 'hihhhello-utils';

import { Transaction } from '@/shared/types/transactionTypes';
import { getNetAmount } from '@/shared/utils/helpers';

type HomePageTransactionsTotalProps = {
  transactions: Transaction[];
};

export const HomePageTransactionsTotal = ({
  transactions,
}: HomePageTransactionsTotalProps) => {
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
    <div className="flex h-full w-full flex-col justify-end gap-2 rounded-3xl bg-main-dark bg-[url('/images/current-balance-bg.png')] px-6 pb-5 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl text-main-white">Expenses</span>
        </div>
      </div>

      <span className="break-words text-3xl leading-relaxed text-white sm:text-6xl">
        {formatUSDDecimal(Math.abs(totalTransactionsAmount))}
      </span>
    </div>
  );
};
