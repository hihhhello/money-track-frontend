'use client';

import { api } from '@/shared/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingToast } from '@/shared/utils/hooks';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import {
  ManageRecurrentTransactionModal,
  ManageRecurrentTransactionModalProps,
} from '@/shared/ui/ManageRecurrentTransactionModal';

const TRANSACTION_TYPE_TO_LABEL = {
  [FinancialOperationType.DEPOSIT]: {
    ADD_NEW_LOADING: 'Adding new recurrent deposit...',
    ADD_SUCCESS: 'You successfully added new recurrent deposit.',
    MODAL_TITLE: 'Add new recurrent deposit',
  },
  [FinancialOperationType.EXPENSE]: {
    ADD_NEW_LOADING: 'Adding new recurrent expense...',
    ADD_SUCCESS: 'You successfully added new recurrent expense.',
    MODAL_TITLE: 'Add new recurrent expense',
  },
};

type AddNewRecurrentTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  recurrentTransactionType: FinancialOperationTypeValue;
};

export const AddNewRecurrentTransactionModal = ({
  handleClose,
  isModalOpen,
  recurrentTransactionType,
}: AddNewRecurrentTransactionModalProps) => {
  const queryClient = useQueryClient();

  const loadingToast = useLoadingToast();

  const { data: categories } = useQuery({
    queryFn: () =>
      api.categories.getAll({
        searchParams: {
          type: recurrentTransactionType,
        },
      }),
    queryKey: ['api.categories.getAll', recurrentTransactionType],
  });

  const handleAddNewRecurrentTransaction: ManageRecurrentTransactionModalProps['handleSubmit'] =
    (newRecurrentTransactionValues) => {
      const toastId = loadingToast.showLoading(
        TRANSACTION_TYPE_TO_LABEL[recurrentTransactionType].ADD_NEW_LOADING,
      );

      return api.recurrentTransactions
        .createOne({
          body: {
            amount: newRecurrentTransactionValues.amount,
            category_id: newRecurrentTransactionValues.categoryId,
            type: recurrentTransactionType,
            description: newRecurrentTransactionValues.description,
            frequency: newRecurrentTransactionValues.frequency,
            end_date: newRecurrentTransactionValues.end_date,
            start_date: newRecurrentTransactionValues.start_date,
          },
        })
        .then(() => {
          queryClient.refetchQueries({
            queryKey: ['api.recurrentTransactions.getAll'],
          });

          loadingToast.handleSuccess({
            message:
              TRANSACTION_TYPE_TO_LABEL[recurrentTransactionType].ADD_SUCCESS,
            toastId,
          });
        })
        .catch(() => {
          loadingToast.handleError({ toastId, message: 'Error' });
        });
    };

  return (
    <ManageRecurrentTransactionModal
      categories={categories}
      handleSubmit={handleAddNewRecurrentTransaction}
      handleClose={handleClose}
      isModalOpen={isModalOpen}
      submitButtonLabel="Add"
      title={TRANSACTION_TYPE_TO_LABEL[recurrentTransactionType].MODAL_TITLE}
    />
  );
};
