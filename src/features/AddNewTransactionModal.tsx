'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { classNames, useBoolean } from 'hihhhello-utils';
import { useState } from 'react';

import { ManageTransactionModal } from '@/features/ManageTransactionModal/ManageTransactionModal';
import { api } from '@/shared/api/api';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import {
  TransactionCreationStep,
  TransactionCreationStepType,
} from '@/shared/types/transactionTypes';
import { useLoadingToast } from '@/shared/utils/hooks';

const TRANSACTION_TYPE_TO_LABEL = {
  [FinancialOperationType.DEPOSIT]: {
    ADD_NEW_LOADING: 'Adding new deposit...',
    ADD_SUCCESS: 'You successfully added new deposit.',
    MODAL_TITLE: 'Add new deposit',
  },
  [FinancialOperationType.EXPENSE]: {
    ADD_NEW_LOADING: 'Adding new expense...',
    ADD_SUCCESS: 'You successfully added new expense.',
    MODAL_TITLE: 'Add new expense',
  },
};

type AddNewTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  transactionType: FinancialOperationTypeValue;
};

export const AddNewTransactionModal = ({
  handleClose,
  isModalOpen,
  transactionType,
}: AddNewTransactionModalProps) => {
  const queryClient = useQueryClient();
  const loadingToast = useLoadingToast();

  const [currentStep, setCurrentStep] = useState<TransactionCreationStepType>(
    TransactionCreationStep.SELECT_CATEGORY,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSpendingGroupIds, setSelectedSpendingGroupIds] = useState<
    number[]
  >([]);
  const spendingGroupsState = useBoolean(false);

  const spendingGroupsQuery = useQuery({
    queryFn: api.spendingGroups.getAll,
    queryKey: ['api.spendingGroups.getAll'],
  });

  const handleAddNewTransaction = (newTransactionValues: {
    amount: string;
    date: string;
    categoryId: number;
    description: string | null;
  }) => {
    const toastId = loadingToast.showLoading(
      TRANSACTION_TYPE_TO_LABEL[transactionType].ADD_NEW_LOADING,
    );

    return api.transactions
      .createOne({
        body: {
          amount: newTransactionValues.amount,
          category_id: newTransactionValues.categoryId,
          date: newTransactionValues.date,
          type: transactionType,
          description: newTransactionValues.description,
          spending_group_ids: spendingGroupsState.value
            ? selectedSpendingGroupIds
            : [],
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        setSelectedCategoryId(null);
        setSelectedSpendingGroupIds([]);
        spendingGroupsState.setFalse();

        loadingToast.handleSuccess({
          message: TRANSACTION_TYPE_TO_LABEL[transactionType].ADD_SUCCESS,
          toastId,
        });
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleSelectSpendingGroupId = (id: number) => {
    setSelectedSpendingGroupIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      }

      return [...prevIds, id];
    });
  };

  return (
    <ManageTransactionModal
      handleSubmit={handleAddNewTransaction}
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      submitButtonLabel="Add"
      title={TRANSACTION_TYPE_TO_LABEL[transactionType].MODAL_TITLE}
      selectedCategoryId={selectedCategoryId}
    >
      <div
        className={classNames(
          'flex mb-2',
          currentStep === TransactionCreationStep.SELECT_CATEGORY
            ? 'justify-end'
            : 'justify-start',
        )}
      >
        {currentStep === TransactionCreationStep.SELECT_GROUP && (
          <button
            className="flex items-center gap-1 text-main-blue"
            onClick={() =>
              setCurrentStep(TransactionCreationStep.SELECT_CATEGORY)
            }
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to categories
          </button>
        )}

        {currentStep === TransactionCreationStep.SELECT_CATEGORY && (
          <button
            className="flex items-center gap-1 text-main-blue"
            onClick={() => setCurrentStep(TransactionCreationStep.SELECT_GROUP)}
          >
            Select group
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {currentStep === TransactionCreationStep.SELECT_CATEGORY && (
        <ManageTransactionModal.Categories
          handleSelectCategoryId={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setCurrentStep(TransactionCreationStep.SELECT_GROUP);
          }}
          selectedCategoryId={selectedCategoryId}
          transactionType={transactionType}
          handleAddNewCategory={({ id }) => setSelectedCategoryId(id)}
        />
      )}

      {currentStep === TransactionCreationStep.SELECT_GROUP && (
        <ManageTransactionModal.SpendingGroups
          spendingGroups={spendingGroupsQuery.data}
          handleSelect={handleSelectSpendingGroupId}
          selectedIds={selectedSpendingGroupIds}
          isLoading={spendingGroupsQuery.isLoading}
          handleToggle={spendingGroupsState.toggle}
          isChecked={spendingGroupsState.value}
        />
      )}
    </ManageTransactionModal>
  );
};
