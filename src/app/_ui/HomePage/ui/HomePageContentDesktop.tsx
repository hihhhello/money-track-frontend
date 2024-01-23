'use client';

import { useState } from 'react';

import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';
import { api } from '@/shared/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { DeleteConfirmationModal } from '@/shared/ui/DeleteConfirmationModal';
import { TransactionItemDesktop } from '@/shared/ui/Transaction/TransactionItemDesktop';

type HomePageContentDesktopProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
  filter: TransactionPeriodFilter;
  handleChangeFilter: (newFilter: TransactionPeriodFilter) => void;
};

export const HomePageContentDesktop = ({
  recurrentTransactions,
  transactions,
  filter,
  handleChangeFilter,
}: HomePageContentDesktopProps) => {
  const queryClient = useQueryClient();
  const loadingToast = useLoadingToast();

  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const {
    value: isDeleteTransactionModalOpen,
    setTrue: handleOpenDeleteTransactionModal,
    setFalse: handleCloseDeleteTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

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
        queryClient.refetchQueries({
          queryKey: ['api.transactions.getAll'],
        });
        handleCloseDeleteTransactionModal();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  return (
    <div className="overflow-y-hidden">
      <div className="flex h-full flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-main-dar text-xl leading-10">
                Last payments
              </span>
            </div>

            <TransactionsPeriodFilterSelect
              filter={filter}
              handleChangeFilter={handleChangeFilter}
            />
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto overflow-x-visible">
            {transactions.map((transaction) => (
              <TransactionItemDesktop
                handleEdit={() => {
                  setSelectedTransaction(transaction);
                  handleOpenEditTransactionModal();
                }}
                handleDelete={() => {
                  setSelectedTransaction(transaction);
                  handleOpenDeleteTransactionModal();
                }}
                key={transaction.id}
                amount={transaction.amount}
                categoryName={transaction.category.name}
                date={transaction.date}
                description={transaction.description}
                type={transaction.type}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div>
              <span className="text-xl leading-10 text-main-dark">
                Upcoming payments
              </span>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {recurrentTransactions.map((transaction) => (
              <TransactionItemDesktop
                key={transaction.id}
                categoryName={transaction.category.name}
                description={transaction.description}
                date={transaction.next_transaction}
                amount={transaction.amount}
                type={transaction.type}
              />
            ))}
          </div>
        </div>
      </div>

      <EditTransactionModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={handleCloseEditTransactionModal}
        selectedTransaction={selectedTransaction}
      />

      <DeleteConfirmationModal
        isModalOpen={isDeleteTransactionModalOpen}
        handleClose={handleCloseDeleteTransactionModal}
        handleSubmit={handleDeleteTransaction}
      />
    </div>
  );
};
