'use client';

import {
  Transaction,
  TransactionPeriodFilterType,
  TransactionsByCategory,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { HomePageContentDesktop } from './ui/HomePageContentDesktop';
import { HomePageContentMobile } from './ui/HomePageContentMobile';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { HomePageAddNewTransactionActions } from './ui/HomePageAddNewTransactionActions';
import { HomePageTransactionsTotal } from './ui/HomePageTransactionsTotal';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';
import {
  DATE_KEYWORD_TO_DATE_RANGE,
  DateRange,
} from '@/shared/utils/dateUtils';
import { formatISO } from 'date-fns';
import { TransactionsMonthFilter } from '@/features/TransactionsMonthFilter';
import { TransactionsDayFilter } from '@/features/TransactionsDayFilter';
import { TransactionsYearFilter } from '@/features/TransactionsYearFilter';

type HomePageContentProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const [transactionsFilter, setTransactionsFilter] =
    useState<TransactionPeriodFilterType>(TransactionPeriodFilter.MONTH);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  const transactionsDateRange: DateRange | undefined = useMemo(() => {
    if (transactionsFilter === TransactionPeriodFilter.ALL) {
      return undefined;
    }

    if (transactionsFilter === TransactionPeriodFilter.MONTH) {
      return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.MONTH]({
        referenceDate: dateFilter,
      });
    }

    if (transactionsFilter === TransactionPeriodFilter.YEAR) {
      return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.YEAR]({
        referenceDate: dateFilter,
      });
    }

    return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.DAY]({
      referenceDate: dateFilter,
    });
  }, [dateFilter, transactionsFilter]);

  const { data: transactions } = useQuery({
    queryFn: ({ queryKey }) => {
      const dateRange = queryKey[1] as unknown as DateRange;

      return api.transactions.getAll({
        searchParams: {
          ...(dateRange && {
            endDate: dateRange.endDate
              ? formatISO(dateRange.endDate, { representation: 'date' })
              : undefined,
            startDate: formatISO(dateRange.startDate, {
              representation: 'date',
            }),
          }),
        },
      });
    },
    queryKey: ['api.transactions.getAll', transactionsDateRange],
    placeholderData: keepPreviousData,
  });

  const { data: recurrentTransactions } = useQuery({
    queryFn: api.recurrentTransactions.getAll,
    queryKey: ['api.recurrentTransactions.getAll'],
    initialData: initialRecurrentTransactions,
  });

  const transactionsByCategory = Object.fromEntries(
    Object.entries(
      (transactions ?? initialTransactions).reduce<TransactionsByCategory>(
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
      ),
    ).sort(([, a], [, b]) => a.totalAmount - b.totalAmount),
  );

  const handleChangeFilter = useCallback(
    (newFilter: TransactionPeriodFilterType) => {
      setTransactionsFilter(newFilter);
      setDateFilter(new Date());
    },
    [],
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex gap-4">
        <TransactionsPeriodFilterSelect
          filter={transactionsFilter}
          handleChangeFilter={handleChangeFilter}
        />

        {transactionsFilter === TransactionPeriodFilter.MONTH && (
          <TransactionsMonthFilter
            handleChange={setDateFilter}
            value={dateFilter}
          />
        )}

        {transactionsFilter === TransactionPeriodFilter.DAY && (
          <TransactionsDayFilter
            handleChange={setDateFilter}
            value={dateFilter}
          />
        )}

        {transactionsFilter === TransactionPeriodFilter.YEAR && (
          <TransactionsYearFilter
            handleChange={setDateFilter}
            value={dateFilter}
          />
        )}
      </div>

      <div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <HomePageTransactionsTotal
            transactions={transactions ?? initialTransactions}
          />
        </div>

        <div className="sm:col-span-2">
          <HomePageAddNewTransactionActions />
        </div>
      </div>

      <HomePageContentDesktop
        recurrentTransactions={recurrentTransactions}
        transactions={transactions ?? initialTransactions}
        transactionsByCategory={transactionsByCategory}
      />

      <HomePageContentMobile
        recurrentTransactions={recurrentTransactions}
        transactions={transactions ?? initialTransactions}
        transactionsByCategory={transactionsByCategory}
      />
    </div>
  );
};
