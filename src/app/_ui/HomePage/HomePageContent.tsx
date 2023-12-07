'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import { PlusIcon } from '@/shared/icons/PlusIcon';
import {
  classNames,
  formatToUSDCurrency,
  getNetAmount,
} from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { useBoolean } from '@/shared/utils/hooks';
import { MinusIcon } from '@/shared/icons/MinusIcon';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@/shared/icons/ChevronDownIcon';
import { useState } from 'react';
import { Transaction } from '@/shared/types/transactionTypes';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { AddNewTransactionModal } from '@/features/AddNewTransactionModal';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';

type HomePageContentProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const {
    value: isAddNewTransactionModalOpen,
    setTrue: handleOpenAddNewTransactionModal,
    setFalse: handleCloseAddNewTransactionModal,
  } = useBoolean(false);

  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [transactionTypeToAdd, setTransactionTypeToAdd] =
    useState<FinancialOperationTypeValue>(FinancialOperationType.EXPENSE);

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
    initialData: initialTransactions,
  });

  const { data: recurrentTransactions } = useQuery({
    queryFn: api.recurrentTransactions.getAll,
    queryKey: ['api.recurrentTransactions.getAll'],
    initialData: initialRecurrentTransactions,
  });

  const transactionsByDate:
    | {
        [date: string]: {
          transactions: Transaction[];
          totalAmount: number;
        };
      }
    | undefined = transactions?.reduce(
    (transactionsByDateAccumulator, transaction) => {
      const key = transaction.date ?? 'None';

      if (!transactionsByDateAccumulator[key]) {
        return {
          ...transactionsByDateAccumulator,
          [key]: {
            transactions: [transaction],
            totalAmount: getNetAmount({
              amount: transaction.amount,
              type: transaction.type,
            }),
          },
        };
      }

      return {
        ...transactionsByDateAccumulator,
        [key]: {
          transactions: [
            ...transactionsByDateAccumulator[key].transactions,
            transaction,
          ],
          totalAmount:
            transactionsByDateAccumulator[key].totalAmount +
            getNetAmount({
              type: transaction.type,
              amount: transaction.amount,
            }),
        },
      };
    },
    {} as {
      [date: string]: {
        transactions: Transaction[];
        totalAmount: number;
      };
    },
  );

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
    <div>
      <div className="mb-4">
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

        <div className="flex w-full gap-4">
          <button
            onClick={() => {
              handleOpenAddNewTransactionModal();
              setTransactionTypeToAdd(FinancialOperationType.DEPOSIT);
            }}
            className="flex flex-1 items-center justify-center rounded-md border-[6px] border-sky-600 py-4 hover:border-sky-700"
          >
            <PlusIcon className="h-16 w-16 text-sky-600" />
          </button>

          <button
            onClick={() => {
              handleOpenAddNewTransactionModal();
              setTransactionTypeToAdd(FinancialOperationType.EXPENSE);
            }}
            className="flex flex-1 items-center justify-center rounded-md border-[6px] border-red-600 py-4 hover:border-red-700"
          >
            <MinusIcon className="h-16 w-16 text-red-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span>Past transactions:</span>

          <div className="flex flex-col gap-4">
            {transactionsByDate &&
              Object.entries(transactionsByDate).map(
                ([date, { transactions, totalAmount }]) => (
                  <Disclosure key={date}>
                    <Disclosure.Button className="flex justify-between pr-4">
                      {({ open }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <ChevronDownIcon
                              className={classNames(open && 'rotate-180')}
                            />

                            <span>
                              {format(parseISO(date), 'EEEE, dd MMMM')}
                            </span>

                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                              {transactions.length}
                            </span>
                          </div>

                          <span
                            className={classNames(
                              totalAmount === 0
                                ? ''
                                : totalAmount < 0
                                  ? 'text-red-600'
                                  : 'text-green-600',
                            )}
                          >
                            {formatToUSDCurrency(totalAmount)}
                          </span>
                        </>
                      )}
                    </Disclosure.Button>

                    <Disclosure.Panel className="flex flex-col pr-2">
                      {transactions.map((transaction) => (
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            handleOpenEditTransactionModal();
                          }}
                          key={transaction.id}
                          className="flex items-center justify-between py-2 pl-10  pr-2 hover:bg-gray-200"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={classNames(
                                'h-2 w-2 rounded-full ring',
                                transaction.type ===
                                  FinancialOperationType.EXPENSE
                                  ? 'bg-red-600 ring-red-200'
                                  : 'bg-green-600 ring-green-200',
                              )}
                            >
                              <span className="sr-only">
                                Transaction type: {transaction.type}
                              </span>
                            </div>

                            <div className="flex flex-col justify-start">
                              <span className="text-left">
                                {transaction.category.name}
                              </span>

                              <p className="text-sm">
                                {transaction.description}
                              </p>
                            </div>
                          </div>

                          <div>
                            <span>
                              {formatToUSDCurrency(
                                parseFloat(transaction.amount),
                              )}
                            </span>
                          </div>
                        </button>
                      ))}
                    </Disclosure.Panel>
                  </Disclosure>
                ),
              )}
          </div>
        </div>

        <div>
          <span>Recurrent transactions:</span>

          <div className="flex flex-col gap-2">
            {recurrentTransactions?.map((transaction) => (
              <div key={transaction.id} className="px-2 py-2">
                <span>
                  {format(
                    parseISO(transaction.next_transaction),
                    'EEEE, dd MMMM',
                  )}
                </span>

                <div className="flex items-center justify-between pl-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={classNames(
                        'h-2 w-2 rounded-full ring',
                        transaction.type === FinancialOperationType.EXPENSE
                          ? 'bg-red-600 ring-red-200'
                          : 'bg-green-600 ring-green-200',
                      )}
                    >
                      <span className="sr-only">
                        Transaction type: {transaction.type}
                      </span>
                    </div>

                    <div className="flex flex-col justify-start">
                      <span className="text-left">
                        {transaction.category.name}
                      </span>

                      <p className="text-sm">{transaction.description}</p>
                    </div>
                  </div>

                  <span>
                    {formatToUSDCurrency(parseFloat(transaction.amount))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddNewTransactionModal
        handleClose={handleCloseAddNewTransactionModal}
        isModalOpen={isAddNewTransactionModalOpen}
        transactionType={transactionTypeToAdd}
      />

      <EditTransactionModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={() => {
          handleCloseEditTransactionModal();
          setSelectedTransaction(null);
        }}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};
