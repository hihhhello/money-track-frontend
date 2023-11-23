'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { api } from '@/shared/api/api';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { MinusIcon } from '@/shared/ui/Icons/MinusIcon';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@/shared/ui/Icons/ChevronDownIcon';
import { ManageTransactionModal } from '@/shared/ui/ManageTransactionModal';
import { useState } from 'react';
import { Transaction } from '@/shared/types/transactionTypes';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { AddNewTransactionModal } from '@/features/AddNewTransactionModal';

const HomePage = () => {
  const loadingToast = useLoadingToast();

  const {
    value: isAddNewTransactionModalOpen,
    setTrue: handleOpenAddNewTransactionModal,
    setFalse: handleCloseAddNewTransactionModal,
  } = useBoolean(false);

  const {
    value: isManageTransactionModalOpen,
    setTrue: handleOpenManageTransactionModal,
    setFalse: handleCloseManageTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [transactionTypeToAdd, setTransactionTypeToAdd] =
    useState<FinancialOperationTypeValue>(FinancialOperationType.EXPENSE);

  const { data: depositCategories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: FinancialOperationType.DEPOSIT,
        },
      }),
    queryKey: ['api.categories.getAll', 'type:deposit'],
  });

  const { data: expenseCategories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: FinancialOperationType.EXPENSE,
        },
      }),
    queryKey: ['api.categories.getAll', 'type:expense'],
  });

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
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
            totalAmount:
              transaction.type === FinancialOperationType.DEPOSIT
                ? parseFloat(transaction.amount)
                : -parseFloat(transaction.amount),
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
            transaction.type === FinancialOperationType.DEPOSIT
              ? transactionsByDateAccumulator[key].totalAmount +
                parseFloat(transaction.amount)
              : transactionsByDateAccumulator[key].totalAmount -
                parseFloat(transaction.amount),
        },
      };
    },
    {} as {
      [date: string]: {
        transactions: any[];
        totalAmount: number;
      };
    },
  );

  const totalTransactionsAmount = transactions
    ? transactions.reduce((totalExpensesAccumulator, transaction) => {
        if (transaction.type === FinancialOperationType.DEPOSIT) {
          return totalExpensesAccumulator + parseFloat(transaction.amount);
        }

        return totalExpensesAccumulator - parseFloat(transaction.amount);
      }, 0)
    : 0;

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading('Deleting your transaction...');

    return api.transactions
      .deleteOne({
        params: {
          transactionId: selectedTransaction.id,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully deleted transaction.',
        });
        refetchTransactions();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleEditTransaction = (transactionValues: {
    amount: string;
    date: string;
    categoryId: number;
    description: string | null;
  }) => {
    if (!selectedTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading('Editing your transaction...');

    return api.transactions
      .editOne({
        body: {
          amount: transactionValues.amount,
          category_id: transactionValues.categoryId,
          date: transactionValues.date,
          description: transactionValues.description,
        },
        params: {
          transactionId: selectedTransaction.id,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully edited transaction.',
        });
        refetchTransactions();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

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

      <div className="flex flex-col gap-4 px-4">
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

                        <span>{format(parseISO(date), 'EEEE, dd MMMM')}</span>

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
                        handleOpenManageTransactionModal();
                      }}
                      key={transaction.id}
                      className="flex items-center justify-between py-2 pl-10  pr-2 hover:bg-gray-200"
                    >
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

                      <div>
                        <span>
                          {formatToUSDCurrency(parseFloat(transaction.amount))}
                        </span>
                      </div>
                    </button>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
            ),
          )}
      </div>

      <AddNewTransactionModal
        handleClose={handleCloseAddNewTransactionModal}
        isModalOpen={isAddNewTransactionModalOpen}
        transactionType={transactionTypeToAdd}
      />

      <ManageTransactionModal
        isModalOpen={isManageTransactionModalOpen}
        handleSubmitTransactionValues={handleEditTransaction}
        categories={
          selectedTransaction?.type === FinancialOperationType.DEPOSIT
            ? depositCategories
            : expenseCategories
        }
        handleClose={() => {
          handleCloseManageTransactionModal();
          setSelectedTransaction(null);
        }}
        title="Edit transaction"
        submitButtonLabel="Edit"
        defaultTransactionValues={
          selectedTransaction
            ? {
                amount: selectedTransaction.amount,
                categoryId: selectedTransaction.category.id,
                date: selectedTransaction.date,
                description: selectedTransaction.description,
              }
            : undefined
        }
        handleDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default HomePage;
