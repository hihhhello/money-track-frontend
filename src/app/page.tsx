'use client';

import { range } from 'lodash';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import {
  classNames,
  formatToUSDCurrency,
  formatToUSDCurrencyNoCents,
} from '@/shared/utils/helpers';
import { ChevronDownIcon } from '@/shared/ui/Icons/ChevronDownIcon';
import { ShoppingBagIcon } from '@/shared/ui/Icons/ShoppingBagIcon';
import { SuitcaseIcon } from '@/shared/ui/Icons/SuitcaseIcon';
import { FormEvent, useState } from 'react';
import { formatISO } from 'date-fns';
import { api } from '@/shared/api/api';
import { useQuery } from '@tanstack/react-query';

const CurrentBalanceCard = () => {
  return (
    <div className="card flex flex-col gap-4 pb-6">
      <div className="flex justify-between">
        <div className="inline-flex-center rounded-[40px] border border-main-dark px-6 py-1">
          <span className="text-xl">Current balance</span>
        </div>

        <div className="flex gap-1">
          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>Together</span>

            <ChevronDownIcon className="stroke-white" />
          </button>

          <button className="flex w-[142px] justify-between rounded-[100px] bg-main-blue px-4 py-3 text-sm leading-6 text-white">
            <span>All sources</span>

            <ChevronDownIcon className="stroke-white" />
          </button>
        </div>
      </div>

      <span className="text-[64px] leading-[96px] text-black">
        {formatToUSDCurrencyNoCents(3800)}
      </span>
    </div>
  );
};

const IncomeCard = () => {
  return (
    <div className="card flex flex-1 flex-col items-center gap-4 pb-8">
      <div className="inline-flex-center rounded-[40px] border border-main-dark px-6 py-1">
        <span className="text-xl">Income</span>
      </div>

      <span className="text-5xl leading-[72px]">
        +{formatToUSDCurrencyNoCents(4563)}
      </span>
    </div>
  );
};

const OutcomeCard = () => {
  return (
    <div className="card flex flex-1 flex-col items-center gap-4 pb-8">
      <div className="inline-flex-center rounded-[40px] border border-main-dark px-6 py-1">
        <span className="text-xl">Expense</span>
      </div>

      <span className="text-5xl leading-[72px]">
        {formatToUSDCurrencyNoCents(-1246)}
      </span>
    </div>
  );
};

const LastTransactionsCard = () => {
  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  return (
    <div className="card flex h-full flex-col">
      <div className="mb-6 flex justify-between">
        <div className="inline-flex-center rounded-[40px] border border-main-dark px-6 py-1">
          <span className="text-xl">Last transactions</span>
        </div>
      </div>

      <div className="overflow-y-auto pr-2">
        {transactions?.map((transaction) =>
          transaction.type === 'deposit' ? (
            <div
              className="mb-2 flex items-center justify-between rounded-2xl bg-white px-5 py-2"
              key={transaction.id}
            >
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center rounded-[4px] bg-main-blue px-2">
                    <span className="text-[10px] text-white">Deposit</span>
                  </div>

                  <div className="flex h-[44px] w-[57px] items-center justify-center rounded-md ring-1 ring-main-blue">
                    <ShoppingBagIcon className="stroke-main-blue" />
                  </div>
                </div>

                {/* <div>
                  <span className="text-xl font-medium leading-7">Jeans</span>

                  <div className="flex flex-col">
                    <span className="text-sm font-light leading-5">
                      BOA Debit Card
                    </span>

                    <span className="text-sm font-light leading-5">13:48</span>
                  </div>
                </div> */}
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-xl font-medium leading-7">
                  {formatToUSDCurrency(parseFloat(transaction.amount))}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="mb-2 flex items-center justify-between rounded-2xl bg-white px-5 py-2"
              key={transaction.id}
            >
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center rounded-[4px] bg-main-orange px-2">
                    <span className="text-[10px] text-white">Expense</span>
                  </div>

                  <div className="flex h-[44px] w-[57px] items-center justify-center rounded-md ring-1 ring-main-orange">
                    <SuitcaseIcon className="fill-main-orange" />
                  </div>
                </div>

                {/* <div>
                  <span className="text-xl font-medium leading-7">Salary</span>

                  <div className="flex flex-col">
                    <span className="text-sm font-light leading-5">
                      BOA Debit Card
                    </span>

                    <span className="text-sm font-light leading-5">13:48</span>
                  </div>
                </div> */}
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-xl font-medium leading-7">
                  +{formatToUSDCurrency(parseFloat(transaction.amount))}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [newTransactionFormValues, setNewTransactionFormValues] = useState<{
    amount: string;
    category: string;
    type: 'expense' | 'deposit';
    date: string;
  }>({
    date: formatISO(new Date(), { representation: 'date' }),
    amount: '',
    category: '',
    type: 'expense',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    api.transactions
      .createOne({
        body: newTransactionFormValues,
      })
      .then((result) => {
        console.log(result);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="mb-4 h-[44px] divide-x-[1px] divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
            <button
              type="button"
              onClick={() =>
                setNewTransactionFormValues((prevValues) => ({
                  ...prevValues,
                  type: 'expense',
                }))
              }
              className={classNames(
                'h-full px-4 text-sm font-semibold',
                newTransactionFormValues.type === 'expense' && 'bg-gray-100',
              )}
            >
              Expense
            </button>

            <button
              onClick={() =>
                setNewTransactionFormValues((prevValues) => ({
                  ...prevValues,
                  type: 'deposit',
                }))
              }
              type="button"
              className={classNames(
                'h-full px-4 text-sm font-semibold',
                newTransactionFormValues.type === 'deposit' && 'bg-gray-100',
              )}
            >
              Deposit
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount">Amount</label>
          <input
            className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
            type="number"
            name="amount"
            value={String(newTransactionFormValues.amount)}
            onChange={(e) => {
              setNewTransactionFormValues((prevValues) => ({
                ...prevValues,
                amount: e.target.value,
              }));
            }}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category">Category</label>
          <input
            className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
            name="category"
            value={newTransactionFormValues.category}
            onChange={(e) => {
              setNewTransactionFormValues((prevValues) => ({
                ...prevValues,
                category: e.target.value,
              }));
            }}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="date">Date</label>
          <input
            className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
            name="date"
            type="date"
            value={newTransactionFormValues.date}
            onChange={(e) => {
              setNewTransactionFormValues((prevValues) => ({
                ...prevValues,
                date: e.target.value,
              }));
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-4 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add
        </button>
      </form>

      <LastTransactionsCard />
    </div>
  );
};

export default HomePage;
