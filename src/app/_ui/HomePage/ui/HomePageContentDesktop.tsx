'use client';

import { Disclosure } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useBoolean, classNames, formatUSDDecimal } from 'hihhhello-utils';
import { useState } from 'react';

import { EditTransactionModal } from '@/features/EditTransactionModal';
import { api } from '@/shared/api/api';
import { ChevronDownIcon } from '@/shared/icons/ChevronDownIcon';
import { QueueListIcon } from '@/shared/icons/QueueListIcon';
import { TagIcon } from '@/shared/icons/TagIcon';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import {
  Transaction,
  TransactionsByCategory,
} from '@/shared/types/transactionTypes';
import { DeleteConfirmationModal } from '@/shared/ui/DeleteConfirmationModal';
import { TransactionByCategoryItemDesktop } from '@/shared/ui/Transaction/TransactionByCategoryItemDesktop';
import { TransactionItemDesktop } from '@/shared/ui/Transaction/TransactionItemDesktop';
import { useLoadingToast } from '@/shared/utils/hooks';

type HomePageContentDesktopProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
  transactionsByCategory: TransactionsByCategory;
};

export const HomePageContentDesktop = ({
  recurrentTransactions,
  transactions,
  transactionsByCategory,
}: HomePageContentDesktopProps) => {
  const queryClient = useQueryClient();
  const loadingToast = useLoadingToast();

  const [view, setView] = useState<'list' | 'category'>('list');

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
    <div className="hidden overflow-y-hidden sm:block">
      <div className="flex h-full flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col rounded-3xl bg-main-paper p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl leading-10">Last payments</span>
            </div>

            <div className="flex gap-2">
              <button
                className="rounded-md bg-main-blue p-1"
                onClick={() =>
                  setView((prev) => (prev === 'category' ? 'list' : 'category'))
                }
              >
                {view === 'list' ? (
                  <QueueListIcon className="text-white" />
                ) : (
                  <TagIcon className="text-white" />
                )}
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto overflow-x-visible pt-6">
            {view === 'list'
              ? transactions.map((transaction) => (
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
                    recurrentTransactionId={transaction.recurrent_id}
                    spendingGroups={transaction.spending_groups}
                  />
                ))
              : Object.entries(transactionsByCategory).map(
                  ([categoryName, record]) => (
                    <Disclosure key={categoryName}>
                      <Disclosure.Button>
                        {({ open }) => (
                          <>
                            <div className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex w-full flex-grow items-start justify-between">
                                <div className="flex gap-2">
                                  <span className="w-full break-words text-left">
                                    {categoryName}
                                  </span>

                                  <span className="inline-flex items-center rounded-md bg-main-blue/10 px-2 py-1 text-xs font-medium text-main-blue ring-1 ring-inset ring-main-blue/10">
                                    {record.transactions.length}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <p
                                    className={classNames(
                                      'w-full break-words text-left sm:text-right',
                                      record.type ===
                                        FinancialOperationType.EXPENSE
                                        ? 'text-main-orange'
                                        : 'text-main-blue',
                                    )}
                                  >
                                    {formatUSDDecimal(
                                      Math.abs(record.totalAmount),
                                    )}
                                  </p>

                                  <ChevronDownIcon
                                    className={classNames(open && 'rotate-180')}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </Disclosure.Button>

                      <Disclosure.Panel className="flex flex-col gap-4 pl-10">
                        {record.transactions.map((transaction) => (
                          <TransactionByCategoryItemDesktop
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
                            date={transaction.date}
                            description={transaction.description}
                            type={transaction.type}
                            recurrentTransactionId={transaction.recurrent_id}
                            spendingGroups={transaction.spending_groups}
                          />
                        ))}
                      </Disclosure.Panel>
                    </Disclosure>
                  ),
                )}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div>
              <span className="text-xl leading-10">Upcoming payments</span>
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
