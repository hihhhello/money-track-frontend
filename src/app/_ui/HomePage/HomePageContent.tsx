'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { SpendingGroup } from '@/shared/types/spendingGroupTypes';
import {
  Transaction,
  TransactionPeriodFilterType,
  TransactionsByCategory,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { Multiselect } from '@/shared/ui/Multiselect';
import { TransactionsDayFilter } from '@/shared/ui/Transaction/TransactionsDayFilter';
import { TransactionsMonthFilter } from '@/shared/ui/Transaction/TransactionsMonthFilter';
import { TransactionsPeriodFilterSelect } from '@/shared/ui/Transaction/TransactionsPeriodFilterSelect';
import { TransactionsYearFilter } from '@/shared/ui/Transaction/TransactionsYearFilter';
import {
  DATE_KEYWORD_TO_DATE_RANGE,
  DateRange,
} from '@/shared/utils/dateUtils';

import { HomePageAddNewTransactionActions } from './ui/HomePageAddNewTransactionActions';
import { HomePageContentDesktop } from './ui/HomePageContentDesktop';
import { HomePageContentMobile } from './ui/HomePageContentMobile';
import { HomePageTransactionsTotal } from './ui/HomePageTransactionsTotal';

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

  const [selectedSpendingGroups, setSelectedSpendingGroups] = useState<
    SpendingGroupOption[]
  >([]);

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
      const spendingGroups = queryKey[2] as unknown as SpendingGroupOption[];

      return api.transactions.getAll({
        searchParams: {
          ...(dateRange && {
            endDate: dateRange.endDate
              ? formatISO(dateRange.endDate, { representation: 'date' })
              : undefined,
            startDate: formatISO(dateRange.startDate, {
              representation: 'date',
            }),
            spendingGroupIds: spendingGroups
              .filter(({ id }) => id !== PERSONAL_TRANSACTIONS_GROUP_OPTION.id)
              .map(({ id }) => Number(id)),
            includePersonal: spendingGroups.some(
              ({ id }) => id === PERSONAL_TRANSACTIONS_GROUP_OPTION.id,
            ),
          }),
        },
      });
    },
    queryKey: [
      'api.transactions.getAll',
      transactionsDateRange,
      selectedSpendingGroups,
    ],
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

  const spendingGroupsQuery = useQuery({
    queryFn: api.spendingGroups.getAll,
    queryKey: ['api.spendingGroups.getAll'],
  });

  const spendingGroupsOptions: SpendingGroupOption[] = useMemo(
    () =>
      spendingGroupsQuery.data
        ? [
            PERSONAL_TRANSACTIONS_GROUP_OPTION,
            ...spendingGroupsQuery.data.map((group) => ({
              id: group.id,
              name: group.name,
            })),
          ]
        : [PERSONAL_TRANSACTIONS_GROUP_OPTION],
    [spendingGroupsQuery.data],
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
      <div className="mb-4 flex flex-col sm:flex-row gap-x-16 gap-y-4">
        <div className="flex gap-4">
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

        <Multiselect
          options={spendingGroupsOptions}
          value={selectedSpendingGroups}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.name}
          handleChangeValue={setSelectedSpendingGroups}
        />
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

/**
 * TODO: move to utils
 */
const PERSONAL_TRANSACTIONS_GROUP_OPTION = {
  id: 'personalTransactionsGroupOption',
  name: 'Personal',
};
type SpendingGroupOption = { id: number | string; name: string };
