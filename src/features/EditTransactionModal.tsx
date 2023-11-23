'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import { ManageTransactionModal } from '@/shared/ui/ManageTransactionModal';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { Transaction } from '@/shared/types/transactionTypes';

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

  const { data: categories } = useQuery({
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

  return (
    <ManageTransactionModal
      isModalOpen={isModalOpen}
      handleSubmit={handleEditTransaction}
      categories={categories}
      handleClose={handleClose}
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
              categoryId: selectedTransaction.category.id,
              date: selectedTransaction.date,
              description: selectedTransaction.description,
            }
          : undefined
      }
      handleDelete={handleDeleteTransaction}
    />
  );
};
