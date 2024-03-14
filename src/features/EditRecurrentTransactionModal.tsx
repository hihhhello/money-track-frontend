'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  ManageRecurrentTransactionModal,
  ManageRecurrentTransactionModalProps,
} from '@/features/ManageRecurrentTransactionModal';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { useLoadingToast } from '@/shared/utils/hooks';

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
  selectedRecurrentTransaction,
}: EditRecurrentTransactionModalProps) => {
  const queryClient = useQueryClient();
  const loadingToast = useLoadingToast();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!selectedRecurrentTransaction) {
      return;
    }

    setSelectedCategoryId(selectedRecurrentTransaction.category.id);
  }, [selectedRecurrentTransaction]);

  const refetchTransactions = () =>
    queryClient.refetchQueries({
      queryKey: ['api.recurrentTransactions.getAll'],
    });

  const handleEditTransaction: ManageRecurrentTransactionModalProps['handleSubmit'] =
    (transactionValues, options) => {
      if (!selectedRecurrentTransaction) {
        return;
      }

      const toastId = loadingToast.showLoading('Editing your transaction...');

      return api.recurrentTransactions
        .editOne({
          body: {
            amount: transactionValues.amount,
            category_id: transactionValues.categoryId,
            description: transactionValues.description,
            ...(options?.isPastStartDate
              ? { next_transaction: transactionValues.start_date }
              : { start_date: transactionValues.start_date }),
          },
          params: {
            transactionId: selectedRecurrentTransaction.id,
          },
        })
        .then(() => {
          loadingToast.handleSuccess({
            toastId,
            message: 'You successfully edited transaction.',
          });
          refetchTransactions();
          setSelectedCategoryId(null);
        })
        .catch(() => {
          loadingToast.handleError({ toastId, message: 'Error' });
        });
    };

  const handleDeleteTransaction = () => {
    if (!selectedRecurrentTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading('Deleting your transaction...');

    return api.recurrentTransactions
      .deleteOne({
        params: {
          transactionId: selectedRecurrentTransaction.id,
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

  return (
    <ManageRecurrentTransactionModal
      isModalOpen={isModalOpen}
      handleSubmit={handleEditTransaction}
      handleClose={handleClose}
      title={
        selectedRecurrentTransaction?.type
          ? TRANSACTION_TYPE_TO_LABEL[selectedRecurrentTransaction.type]
              .MODAL_TITLE
          : 'Edit ...'
      }
      submitButtonLabel="Edit"
      defaultValues={
        selectedRecurrentTransaction
          ? {
              amount: selectedRecurrentTransaction.amount,
              categoryId: selectedRecurrentTransaction.category.id,
              end_date: selectedRecurrentTransaction.end_date,
              frequency: selectedRecurrentTransaction.frequency,
              start_date: selectedRecurrentTransaction.start_date,
              description: selectedRecurrentTransaction.description,
              next_date: selectedRecurrentTransaction.next_transaction,
            }
          : undefined
      }
      handleDelete={handleDeleteTransaction}
      selectedCategoryId={selectedCategoryId}
    >
      <ManageRecurrentTransactionModal.Categories
        handleSelectCategoryId={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
        handleAddNewCategory={({ id }) => setSelectedCategoryId(id)}
        transactionType={selectedRecurrentTransaction?.type}
      />
    </ManageRecurrentTransactionModal>
  );
};
