'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import {
  ManageRecurrentTransactionModal,
  ManageRecurrentTransactionModalProps,
} from '@/shared/ui/ManageRecurrentTransactionModal';
import { toast } from 'react-toastify';

const TRANSACTION_TYPE_TO_LABEL = {
  [FinancialOperationType.DEPOSIT]: {
    ADD_NEW_LOADING: 'Editing recurrent deposit...',
    ADD_SUCCESS: 'You successfully edited recurrent deposit.',
    MODAL_TITLE: 'Edit recurrent deposit',
  },
  [FinancialOperationType.EXPENSE]: {
    ADD_NEW_LOADING: 'Editing expense...',
    ADD_SUCCESS: 'You successfully edited recurrent expense.',
    MODAL_TITLE: 'Edit recurrent expense',
  },
};

type EditRecurrentTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  selectedRecurrentTransaction: RecurrentTransaction | null;
};

export const EditRecurrentTransactionModal = ({
  handleClose,
  isModalOpen,
  selectedRecurrentTransaction: selectedTransaction,
}: EditRecurrentTransactionModalProps) => {
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
      queryKey: ['api.recurrentTransactions.getAll'],
    });

  const handleEditTransaction: ManageRecurrentTransactionModalProps['handleSubmit'] =
    (transactionValues) => {
      if (!selectedTransaction) {
        return;
      }

      const toastId = loadingToast.showLoading('Editing your transaction...');

      return api.recurrentTransactions
        .editOne({
          body: {
            amount: transactionValues.amount,
            category_id: transactionValues.categoryId,
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

    toast.warning('Deleting is not implemented yet.');
  };

  return (
    <ManageRecurrentTransactionModal
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
              end_date: selectedTransaction.end_date,
              frequency: selectedTransaction.frequency,
              start_date: selectedTransaction.start_date,
              description: selectedTransaction.description,
            }
          : undefined
      }
      handleDelete={handleDeleteTransaction}
    />
  );
};
