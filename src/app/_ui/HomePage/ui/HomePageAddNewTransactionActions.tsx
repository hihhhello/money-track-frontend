'use client';

import { PlusIcon } from '@/shared/icons/PlusIcon';
import { useBoolean } from 'hihhhello-utils';
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
          className="flex flex-1 items-center justify-center rounded-3xl bg-main-blue/95 py-2 hover:bg-main-blue sm:py-4"
        >
          <MinusIcon className="h-10 w-10 text-main-white sm:h-16 sm:w-16" />
        </button>

        <button
          onClick={() => {
            handleOpenAddNewTransactionModal();
            setTransactionTypeToAdd(FinancialOperationType.DEPOSIT);
          }}
          className="group flex flex-1 items-center justify-center rounded-3xl border-[6px] border-main-blue/95 py-2 hover:border-main-blue sm:py-4"
        >
          <PlusIcon className="h-10 w-10 text-main-blue/95 group-hover:text-main-blue sm:h-16 sm:w-16" />
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
