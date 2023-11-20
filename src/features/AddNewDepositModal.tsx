'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import { AddNewTransactionModal } from '@/shared/ui/AddNewTransactionModal';

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

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: 'deposit',
        },
      }),
    queryKey: ['api.categories.getAll', 'type:deposit'],
  });

  const handleAddNewTransaction = (newTransactionValues: {
    amount: string;
    date: string;
    categoryId: number;
  }) => {
    const toastId = loadingToast.showLoading('Adding new deposit...');

    return api.transactions
      .createOne({
        body: {
          amount: newTransactionValues.amount,
          category_id: newTransactionValues.categoryId,
          date: newTransactionValues.date,
          type: 'deposit',
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

  const handleAddNewCategory = (categoryName: string) => {
    return api.categories.createOne({
      body: {
        name: categoryName,
        type: 'deposit',
      },
    });
  };

  return (
    <AddNewTransactionModal
      categories={categories}
      handleAddNewCategory={handleAddNewCategory}
      handleAddNewTransaction={handleAddNewTransaction}
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      handleSuccessAddNewCategory={refetchCategories}
    />
  );
};
