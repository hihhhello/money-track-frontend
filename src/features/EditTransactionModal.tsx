'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { ManageTransactionModal } from '@/shared/ui/ManageTransactionModal';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { Transaction } from '@/shared/types/transactionTypes';
import { useEffect, useState } from 'react';
import { ManageCategoryModal } from '@/shared/ui/ManageCategoryModal';

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

  useEffect(() => {
    if (!selectedTransaction) {
      return;
    }

    setSelectedCategoryId(selectedTransaction.category.id);
  }, [selectedTransaction]);

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const {
    data: categories,
    refetch: refetchCategories,
    isLoading: isCategoriesLoading,
  } = useQuery({
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

        refetchCategories();

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

  return (
    <ManageTransactionModal
      isModalOpen={isModalOpen}
      handleSubmit={handleEditTransaction}
      categories={categories}
      handleClose={handleClose}
      handleAddNewCategory={handleOpenAddNewCategoryModal}
      isCategoriesLoading={isCategoriesLoading}
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
      handleDelete={handleDeleteTransaction}
      handleSelectCategoryId={setSelectedCategoryId}
      selectedCategoryId={selectedCategoryId}
      nestedModal={
        <ManageCategoryModal
          handleClose={handleCloseAddNewCategoryModal}
          handleSubmit={handleAddNewCategory}
          isModalOpen={isAddNewCategoryModalOpen}
          title="Add new category"
          submitButtonLabel="Add"
        />
      }
    />
  );
};
