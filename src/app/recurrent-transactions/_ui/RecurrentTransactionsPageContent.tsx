'use client';

import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'hihhhello-utils';
import { useState } from 'react';

import { AddNewRecurrentTransactionModal } from '@/features/AddNewRecurrentTransactionModal';
import { EditRecurrentTransactionModal } from '@/features/EditRecurrentTransactionModal';
import { api } from '@/shared/api/api';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';

import { RecurrentTransactionsTable } from './RecurrentTransactionsTable';

type RecurrentTransactionsPageContentProps = {
  recurrentTransactions: RecurrentTransaction[];
};

export const RecurrentTransactionsPageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
}: RecurrentTransactionsPageContentProps) => {
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
    initialData: initialRecurrentTransactions,
  });

  return (
    <div className="flex-grow overflow-y-hidden">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => {
              handleOpenAddNewRecurrentTransactionModal();
              setTransactionTypeToAdd(FinancialOperationType.DEPOSIT);
            }}
            className="rounded bg-main-blue px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-main-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
          >
            Add recurrent deposit
          </button>

          <button
            onClick={() => {
              handleOpenAddNewRecurrentTransactionModal();
              setTransactionTypeToAdd(FinancialOperationType.EXPENSE);
            }}
            className="rounded bg-main-blue px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-main-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
          >
            Add recurrent expense
          </button>
        </div>

        <RecurrentTransactionsTable
          recurrentTransactions={recurrentTransactions ?? []}
          handleEditTransaction={(transaction) => {
            setSelectedRecurrentTransaction(transaction);
            handleOpenEditTransactionModal();
          }}
        />
      </div>

      <AddNewRecurrentTransactionModal
        handleClose={handleCloseAddNewRecurrentTransactionModal}
        isModalOpen={isAddNewRecurrentTransactionModalOpen}
        recurrentTransactionType={transactionTypeToAdd}
      />

      <EditRecurrentTransactionModal
        handleClose={() => {
          handleCloseEditTransactionModal();
          setSelectedRecurrentTransaction(null);
        }}
        isModalOpen={isEditTransactionModalOpen}
        selectedRecurrentTransaction={selectedRecurrentTransaction}
      />
    </div>
  );
};
