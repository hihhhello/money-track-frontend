'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { classNames, useBoolean } from 'hihhhello-utils';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

import { ManageTransactionModal } from '@/features/ManageTransactionModal/ManageTransactionModal';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import {
  Transaction,
  TransactionCreationStep,
  TransactionCreationStepType,
} from '@/shared/types/transactionTypes';
import { useLoadingToast } from '@/shared/utils/hooks';

const TRANSACTION_TYPE_TO_LABEL = {
  [FinancialOperationType.DEPOSIT]: {
    ADD_NEW_LOADING: 'Editing deposit...',
    ADD_SUCCESS: 'You successfully edited deposit.',
    MODAL_TITLE: 'Edit deposit',
  },
  [FinancialOperationType.EXPENSE]: {
    ADD_NEW_LOADING: 'Editing expense...',
    ADD_SUCCESS: 'You successfully edited expense.',
    MODAL_TITLE: 'Edit expense',
  },
};

type EditTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  selectedTransaction: Transaction | null;
};

export const EditTransactionModal = ({
  handleClose,
  isModalOpen,
  selectedTransaction,
}: EditTransactionModalProps) => {
  const queryClient = useQueryClient();
  const loadingToast = useLoadingToast();

  const [currentStep, setCurrentStep] = useState<TransactionCreationStepType>(
    TransactionCreationStep.SELECT_CATEGORY,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    selectedTransaction?.category.id ?? null,
  );
  const [selectedSpendingGroupIds, setSelectedSpendingGroupIds] = useState<
    number[]
  >(selectedTransaction?.spending_groups.map(({ id }) => id) ?? []);
  const { setTrue: handleOpenSpendingGroups, ...spendingGroupsState } =
    useBoolean(false);

  useEffect(() => {
    if (!selectedTransaction) {
      return;
    }

    setSelectedCategoryId(selectedTransaction.category.id);

    if (!isEmpty(selectedTransaction.spending_groups)) {
      setSelectedSpendingGroupIds(
        selectedTransaction?.spending_groups.map(({ id }) => id),
      );
      handleOpenSpendingGroups();
    }
  }, [handleOpenSpendingGroups, selectedTransaction]);

  const spendingGroupsQuery = useQuery({
    queryFn: api.spendingGroups.getAll,
    queryKey: ['api.spendingGroups.getAll'],
  });

  const refetchTransactions = () =>
    queryClient.refetchQueries({
      queryKey: ['api.transactions.getAll'],
    });

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
          // spending_group_ids: spendingGroupsState.value
          //   ? selectedSpendingGroupIds
          //   : [],
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
        setSelectedSpendingGroupIds([]);
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

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
        setSelectedCategoryId(null);
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
      isModalOpen={isModalOpen}
      handleSubmit={handleEditTransaction}
      handleClose={handleClose}
      handleDelete={handleDeleteTransaction}
      title={
        selectedTransaction?.type
          ? TRANSACTION_TYPE_TO_LABEL[selectedTransaction.type].MODAL_TITLE
          : 'Edit ...'
      }
      submitButtonLabel="Edit"
      defaultValues={
        selectedTransaction
          ? {
              amount: selectedTransaction.amount,
              date: selectedTransaction.date,
              description: selectedTransaction.description,
            }
          : undefined
      }
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
          handleAddNewCategory={({ id }) => setSelectedCategoryId(id)}
          handleSelectCategoryId={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setCurrentStep(TransactionCreationStep.SELECT_GROUP);
          }}
          selectedCategoryId={selectedCategoryId}
          transactionType={selectedTransaction?.type}
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
