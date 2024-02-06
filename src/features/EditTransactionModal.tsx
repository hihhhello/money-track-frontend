'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean } from 'hihhhello-utils';
import { ManageTransactionModal } from '@/shared/ui/Transaction/ManageTransactionModal/ManageTransactionModal';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { Transaction } from '@/shared/types/transactionTypes';
import { useEffect, useState } from 'react';
import { ManageCategoryModal } from '@/shared/ui/Category/ManageCategoryModal';
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

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    selectedTransaction?.category.id ?? null,
  );
  const [selectedSpendingGroupIds, setSelectedSpendingGroupIds] = useState<
    number[]
  >(selectedTransaction?.spending_groups.map(({ id }) => id) ?? []);

  useEffect(() => {
    if (!selectedTransaction) {
      return;
    }

    setSelectedCategoryId(selectedTransaction.category.id);
    setSelectedSpendingGroupIds(
      selectedTransaction?.spending_groups.map(({ id }) => id),
    );
  }, [selectedTransaction]);

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const spendingGroupsQuery = useQuery({
    queryFn: api.spendingGroups.getAll,
    queryKey: ['api.spendingGroups.getAll'],
  });

  const categoriesQuery = useQuery({
    queryFn: () => {
      if (!selectedTransaction) {
        return;
      }

      return api.categories.getAll({
        searchParams: {
          type: selectedTransaction.type,
        },
      });
    },
    queryKey: ['api.categories.getAll', selectedTransaction?.type],
    enabled: Boolean(selectedTransaction),
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
          // spending_group_ids: selectedSpendingGroupIds,
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

  const handleAddNewCategory = (categoryName: string) => {
    if (!selectedTransaction?.type) {
      return;
    }

    const toastId = loadingToast.showLoading('Adding your new category...');

    return api.categories
      .createOne({
        body: {
          name: categoryName,
          type: selectedTransaction.type,
        },
      })
      .then(({ id }) => {
        setSelectedCategoryId(id);

        categoriesQuery.refetch();

        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully added a new category!',
        });
      })
      .catch(() => {
        loadingToast.handleError({
          toastId,
          message:
            'Something gone wrong while adding your category. Try again.',
        });
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
      <ManageTransactionModal.Categories
        categories={categoriesQuery.data}
        handleAddNewCategory={handleOpenAddNewCategoryModal}
        handleSelectCategoryId={setSelectedCategoryId}
        isLoading={categoriesQuery.isLoading}
        selectedCategoryId={selectedCategoryId}
      />

      {/* <ManageTransactionModal.SpendingGroups
        spendingGroups={spendingGroupsQuery.data}
        handleSelect={handleSelectSpendingGroupId}
        selectedIds={selectedSpendingGroupIds}
        isLoading={spendingGroupsQuery.isLoading}
        handleDeselectAll={() => setSelectedSpendingGroupIds([])}
      /> */}

      <ManageCategoryModal
        handleClose={handleCloseAddNewCategoryModal}
        handleSubmit={handleAddNewCategory}
        isModalOpen={isAddNewCategoryModalOpen}
        title="Add new category"
        submitButtonLabel="Add"
      />
    </ManageTransactionModal>
  );
};
