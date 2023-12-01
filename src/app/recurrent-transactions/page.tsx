'use client';

import { AddNewRecurrentTransactionModal } from '@/features/AddNewRecurrentTransactionModal';
import { EditRecurrentTransactionModal } from '@/features/EditRecurrentTransactionModal';
import { api } from '@/shared/api/api';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { useBoolean } from '@/shared/utils/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const RecurrentTransactionsPage = () => {
  const {
    value: isAddNewRecurrentTransactionModalOpen,
    setTrue: handleOpenAddNewRecurrentTransactionModal,
    setFalse: handleCloseAddNewRecurrentTransactionModal,
  } = useBoolean(false);

  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const [selectedRecurrentTransaction, setSelectedRecurrentTransaction] =
    useState<RecurrentTransaction | null>(null);

  const [transactionTypeToAdd, setTransactionTypeToAdd] =
    useState<FinancialOperationTypeValue>(FinancialOperationType.EXPENSE);

  const { data: recurrentTransactions } = useQuery({
    queryFn: api.recurrentTransactions.getAll,
    queryKey: ['api.recurrentTransactions.getAll'],
  });

  return (
    <div>
      <h1>Recurrent transactions</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => {
            handleOpenAddNewRecurrentTransactionModal();
            setTransactionTypeToAdd(FinancialOperationType.DEPOSIT);
          }}
          className="rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add recurrent deposit
        </button>

        <button
          onClick={() => {
            handleOpenAddNewRecurrentTransactionModal();
            setTransactionTypeToAdd(FinancialOperationType.EXPENSE);
          }}
          className="rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add recurrent expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        {recurrentTransactions?.map((transaction) => (
          <div key={transaction.id} className="rounded-lg bg-white shadow-lg">
            <div className="rounded-t-lg bg-indigo-600 px-4 py-2 text-white">
              <h3>{transaction.category.name}</h3>
            </div>

            <div className="p-4">
              <p className="text-gray-700">Type: {transaction.type}</p>

              <p className="text-gray-700">
                Frequency: {transaction.frequency}
              </p>

              <p className="text-gray-700">
                Next Transaction: {transaction.next_transaction}
              </p>

              <p className="text-gray-700">Amount: {transaction.amount}</p>

              {transaction.description && (
                <p className="text-gray-700">
                  Description: {transaction.description}
                </p>
              )}

              {transaction.start_date && (
                <p className="text-gray-700">
                  Start Date: {transaction.start_date}
                </p>
              )}

              {transaction.end_date && (
                <p className="text-gray-700">
                  End Date: {transaction.end_date}
                </p>
              )}
            </div>

            <div className="w-full border-t-2 px-4 py-2">
              <button
                onClick={() => {
                  setSelectedRecurrentTransaction(transaction);
                  handleOpenEditTransactionModal();
                }}
                className="text-indigo-600 hover:text-indigo-400"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddNewRecurrentTransactionModal
        handleClose={handleCloseAddNewRecurrentTransactionModal}
        isModalOpen={isAddNewRecurrentTransactionModalOpen}
        recurrentTransactionType={transactionTypeToAdd}
      />

      <EditRecurrentTransactionModal
        handleClose={handleCloseEditTransactionModal}
        isModalOpen={isEditTransactionModalOpen}
        selectedRecurrentTransaction={selectedRecurrentTransaction}
      />
    </div>
  );
};

export default RecurrentTransactionsPage;
