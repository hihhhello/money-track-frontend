'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ManageTransactionModal } from '@/features/ManageTransactionModal/ManageTransactionModal';
import { api } from '@/shared/api/api';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import '@/shared/types/transactionTypes';
import { useLoadingToast } from '@/shared/utils/hooks';

import { ManageTransactionModalStepsNavigation } from './ManageTransactionModal/components/ManageTransactionModalTabsNavigation';
import {
  ManageTransactionModalTab,
  ManageTransactionModalTabType,
} from './ManageTransactionModal/utils/manageTransactionModalTypes';

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

  const [currentTab, setCurrentTab] = useState<ManageTransactionModalTabType>(
    ManageTransactionModalTab.CATEGORIES,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSpendingGroupIds, setSelectedSpendingGroupIds] = useState<
    number[]
  >([]);

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
          spending_group_ids: selectedSpendingGroupIds,
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        setSelectedCategoryId(null);
        setSelectedSpendingGroupIds([]);
        setCurrentTab(ManageTransactionModalTab.CATEGORIES);

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
      <ManageTransactionModalStepsNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {currentTab === ManageTransactionModalTab.CATEGORIES && (
        <ManageTransactionModal.Categories
          handleSelectCategoryId={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setCurrentTab(ManageTransactionModalTab.GROUPS);
          }}
          selectedCategoryId={selectedCategoryId}
          transactionType={transactionType}
          handleAddNewCategory={({ id }) => setSelectedCategoryId(id)}
        />
      )}

      {currentTab === ManageTransactionModalTab.GROUPS && (
        <ManageTransactionModal.SpendingGroups
          spendingGroups={spendingGroupsQuery.data}
          handleSelect={handleSelectSpendingGroupId}
          selectedIds={selectedSpendingGroupIds}
          isLoading={spendingGroupsQuery.isLoading}
        />
      )}
    </ManageTransactionModal>
  );
};
