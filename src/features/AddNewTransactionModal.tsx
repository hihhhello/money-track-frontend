'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean } from 'hihhhello-utils';
import { ManageTransactionModal } from '@/shared/ui/Transaction/ManageTransactionModal/ManageTransactionModal';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { ManageCategoryModal } from '@/shared/ui/Category/ManageCategoryModal';
import { useState } from 'react';
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

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSpendingGroupIds, setSelectedSpendingGroupIds] = useState<
    number[]
  >([]);

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const categoriesQuery = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: transactionType,
        },
      }),
    queryKey: ['api.categories.getAll', transactionType],
  });

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

        // handleSelectCategoryId(null);

        loadingToast.handleSuccess({
          message: TRANSACTION_TYPE_TO_LABEL[transactionType].ADD_SUCCESS,
          toastId,
        });
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleAddNewCategory = (categoryName: string) => {
    if (!transactionType) {
      return;
    }

    const toastId = loadingToast.showLoading('Adding your new category...');

    return api.categories
      .createOne({
        body: {
          name: categoryName,
          type: transactionType,
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
      handleSubmit={handleAddNewTransaction}
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      submitButtonLabel="Add"
      title={TRANSACTION_TYPE_TO_LABEL[transactionType].MODAL_TITLE}
      selectedCategoryId={selectedCategoryId}
      spendingGroups={spendingGroupsQuery.data}
      isSpendingGroupsLoading={spendingGroupsQuery.isLoading}
      selectedSpendingGroupIds={selectedSpendingGroupIds}
      handleSelectSpendingGroupId={handleSelectSpendingGroupId}
      handleClearSpendingGroups={() => setSelectedSpendingGroupIds([])}
    >
      <ManageTransactionModal.Categories
        categories={categoriesQuery.data}
        handleAddNewCategory={handleOpenAddNewCategoryModal}
        handleSelectCategoryId={setSelectedCategoryId}
        isLoading={categoriesQuery.isLoading}
        selectedCategoryId={selectedCategoryId}
      />

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
