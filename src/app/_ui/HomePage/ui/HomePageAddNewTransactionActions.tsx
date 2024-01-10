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
    <div className="h-full">
      <div className="flex h-full w-full gap-4">
        <button
          onClick={() => {
            handleOpenAddNewTransactionModal();
            setTransactionTypeToAdd(FinancialOperationType.EXPENSE);
          }}
          className="flex flex-1 items-center justify-center rounded-md bg-main-blue/95 py-4 hover:bg-main-blue"
        >
          <MinusIcon className="h-16 w-16 text-main-white" />
        </button>

        <button
          onClick={() => {
            handleOpenAddNewTransactionModal();
            setTransactionTypeToAdd(FinancialOperationType.DEPOSIT);
          }}
          className="group flex flex-1 items-center justify-center rounded-md border-[6px] border-main-blue/95 py-4 hover:border-main-blue"
        >
          <PlusIcon className="h-16 w-16 text-main-blue/95 group-hover:text-main-blue" />
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
