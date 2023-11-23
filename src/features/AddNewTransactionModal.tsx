'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import { ManageTransactionModal } from '@/shared/ui/ManageTransactionModal';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';

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

  const { data: categories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: transactionType,
        },
      }),
    queryKey: ['api.categories.getAll', transactionType],
  });

  console.log(transactionType);

  console.log(categories);

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
          type: FinancialOperationType.EXPENSE,
          description: newTransactionValues.description,
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        loadingToast.handleSuccess({
          message: TRANSACTION_TYPE_TO_LABEL[transactionType].ADD_SUCCESS,
          toastId,
        });
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  return (
    <ManageTransactionModal
      categories={categories}
      handleSubmitTransactionValues={handleAddNewTransaction}
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      submitButtonLabel="Add"
      title={TRANSACTION_TYPE_TO_LABEL[transactionType].ADD_NEW_LOADING}
    />
  );
};
