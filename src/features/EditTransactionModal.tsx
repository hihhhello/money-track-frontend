'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean } from 'hihhhello-utils';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

import { ManageTransactionModal } from '@/features/ManageTransactionModal/ManageTransactionModal';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { Transaction } from '@/shared/types/transactionTypes';
import { useLoadingToast } from '@/shared/utils/hooks';

import { ManageTransactionModalStepsNavigation } from './ManageTransactionModal/components/ManageTransactionModalTabsNavigation';
import {
  ManageTransactionModalTab,
  ManageTransactionModalTabType,
} from './ManageTransactionModal/utils/manageTransactionModalTypes';

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

  const [currentTab, setCurrentTab] = useState<ManageTransactionModalTabType>(
    ManageTransactionModalTab.CATEGORIES,
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
          spending_group_ids: spendingGroupsState.value
            ? selectedSpendingGroupIds
            : [],
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
        setCurrentTab(ManageTransactionModalTab.CATEGORIES);
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
      <ManageTransactionModalStepsNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {currentTab === ManageTransactionModalTab.CATEGORIES && (
        <ManageTransactionModal.Categories
          handleAddNewCategory={({ id }) => setSelectedCategoryId(id)}
          handleSelectCategoryId={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setCurrentTab(ManageTransactionModalTab.GROUPS);
          }}
          selectedCategoryId={selectedCategoryId}
          transactionType={selectedTransaction?.type}
        />
      )}

      {currentTab === ManageTransactionModalTab.GROUPS && (
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
