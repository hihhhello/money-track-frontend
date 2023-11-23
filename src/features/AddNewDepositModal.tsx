'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import { ManageTransactionModal } from '@/shared/ui/ManageTransactionModal';
import { FinancialOperationType } from '@/shared/types/globalTypes';

type AddNewDepositModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
};

export const AddNewDepositModal = ({
  handleClose,
  isModalOpen,
}: AddNewDepositModalProps) => {
  const queryClient = useQueryClient();

  const loadingToast = useLoadingToast();

  const { data: categories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: FinancialOperationType.DEPOSIT,
        },
      }),
    queryKey: ['api.categories.getAll', 'type:deposit'],
  });

  const handleAddNewTransaction = (newTransactionValues: {
    amount: string;
    date: string;
    categoryId: number;
    description: string | null;
  }) => {
    const toastId = loadingToast.showLoading('Adding new deposit...');

    return api.transactions
      .createOne({
        body: {
          amount: newTransactionValues.amount,
          category_id: newTransactionValues.categoryId,
          date: newTransactionValues.date,
          type: FinancialOperationType.DEPOSIT,
          description: newTransactionValues.description,
        },
      })
      .then(() => {
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });

        loadingToast.handleSuccess({
          message: 'New deposit has been added.',
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
      title="Add new deposit"
    />
  );
};
