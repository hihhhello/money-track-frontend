'use client';

import { PlusIcon } from '@/shared/icons/PlusIcon';
import { useBoolean } from '@/shared/utils/hooks';
import { MinusIcon } from '@/shared/icons/MinusIcon';
import { useState } from 'react';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { AddNewTransactionModal } from '@/features/AddNewTransactionModal';

export const HomePageAddNewTransactionActions = () => {
  const {
    value: isAddNewTransactionModalOpen,
    setTrue: handleOpenAddNewTransactionModal,
    setFalse: handleCloseAddNewTransactionModal,
  } = useBoolean(false);

  const [transactionTypeToAdd, setTransactionTypeToAdd] =
    useState<FinancialOperationTypeValue>(FinancialOperationType.EXPENSE);

  return (
    <div className="flex-1">
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

      <AddNewTransactionModal
        handleClose={handleCloseAddNewTransactionModal}
        isModalOpen={isAddNewTransactionModalOpen}
        transactionType={transactionTypeToAdd}
      />
    </div>
  );
};
