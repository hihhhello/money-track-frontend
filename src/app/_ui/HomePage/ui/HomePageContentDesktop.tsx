'use client';

import { Fragment, useState } from 'react';
import { format, parseISO } from 'date-fns';

import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';
import { Menu, Transition } from '@headlessui/react';
import { ThreeDotsVerticalIcon } from '@/shared/icons/ThreeDotsVerticalIcon';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { api } from '@/shared/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { DeleteConfirmationModal } from '@/shared/ui/DeleteConfirmationModal';

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
              <span className="text-xl text-main-dark">Last payments</span>
            </div>

            <TransactionsPeriodFilterSelect
              filter={filter}
              handleChangeFilter={handleChangeFilter}
            />
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto overflow-x-visible">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex w-full flex-grow flex-col items-start">
                  <span className="w-full break-words text-left">
                    {transaction.category.name}
                  </span>

                  <p className="w-full break-words text-left text-sm">
                    {transaction.description}
                  </p>

                  <p className="w-full break-words text-left text-sm">
                    {format(parseISO(transaction.date), 'EEEE, dd MMMM')}
                  </p>
                </div>

                <div className="w-full flex-grow">
                  <p
                    className={classNames(
                      'w-full break-words text-left sm:text-right',
                      transaction.type === FinancialOperationType.EXPENSE
                        ? 'text-main-orange'
                        : 'text-main-blue',
                    )}
                  >
                    {formatUSDDecimal(parseFloat(transaction.amount))}
                  </p>
                </div>

                <Menu as="div" className="relative ml-3">
                  {({ open }) => (
                    <>
                      <Menu.Button
                        className={classNames(
                          'rounded-md bg-main-blue',
                          open && 'bg-main-dark',
                        )}
                      >
                        <ThreeDotsVerticalIcon className="text-white" />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 top-0 z-10 w-[115px] origin-top-left -translate-x-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  handleOpenEditTransactionModal();
                                }}
                                className={classNames(
                                  'flex w-full items-center gap-2 rounded-t-md px-4 py-2',
                                  active && 'bg-main-blue/10',
                                )}
                              >
                                <PencilIcon
                                  className={classNames(
                                    'h-5 w-5 text-gray-500',
                                    active && 'text-main-blue',
                                  )}
                                />

                                <span
                                  className={classNames(
                                    'h-5 w-5 text-gray-500',
                                    active && 'text-main-blue',
                                  )}
                                >
                                  Edit
                                </span>
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  handleOpenDeleteTransactionModal();
                                }}
                                className={classNames(
                                  'flex w-full items-center gap-2 rounded-b-md px-4 py-2',
                                  active && 'bg-red-100',
                                )}
                              >
                                <TrashIcon
                                  className={classNames(
                                    'h-5 w-5 text-gray-500',
                                    active && 'text-red-600',
                                  )}
                                />

                                <span
                                  className={classNames(
                                    'h-5 w-5 text-gray-500',
                                    active && 'text-red-600',
                                  )}
                                >
                                  Delete
                                </span>
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div>
              <span className="text-xl text-main-dark">Upcoming payments</span>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {recurrentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 hover:bg-gray-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex w-full flex-grow flex-col items-start">
                  <span className="w-full break-words text-left">
                    {transaction.category.name}
                  </span>

                  <p className="w-full break-words text-left text-sm">
                    {transaction.description}
                  </p>

                  <p className="w-full break-words text-left text-sm">
                    {format(
                      parseISO(transaction.next_transaction),
                      'EEEE, dd MMMM',
                    )}
                  </p>
                </div>

                <div className="w-full flex-grow">
                  <p
                    className={classNames(
                      'w-full break-words text-left sm:text-right',
                      transaction.type === FinancialOperationType.EXPENSE
                        ? 'text-main-orange'
                        : 'text-main-blue',
                    )}
                  >
                    {formatUSDDecimal(parseFloat(transaction.amount))}
                  </p>
                </div>
              </div>
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
