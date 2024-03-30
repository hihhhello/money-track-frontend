'use client';

import { Disclosure } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { classNames, formatUSDDecimal } from 'hihhhello-utils';
import { useBoolean } from 'hihhhello-utils';
import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMount } from 'react-use';
import { twMerge } from 'tailwind-merge';

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
import { TransactionByCategoryItemMobile } from '@/shared/ui/Transaction/TransactionByCategoryItemMobile';
import { TransactionItemMobile } from '@/shared/ui/Transaction/TransactionItemMobile';
import { useLoadingToast } from '@/shared/utils/hooks';

type HomePageContentMobileProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
  transactionsByCategory: TransactionsByCategory;
};

export const HomePageContentMobile = ({
  recurrentTransactions,
  transactions,
  transactionsByCategory,
}: HomePageContentMobileProps) => {
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

  const [tab, setTab] = useState<'lastPayments' | 'upcomingPayments'>(
    'lastPayments',
  );

  const [view, setView] = useState<'list' | 'category'>('list');

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
    <div className="flex flex-grow overflow-hidden sm:hidden">
      <div className="flex flex-grow flex-col overflow-hidden rounded-3xl bg-main-paper p-3">
        <div className="flex items-center justify-between">
          <Tabs value={tab}>
            <span
              key="lastPayments"
              onClick={() => setTab('lastPayments')}
              className="cursor-pointer px-4 text-center text-sm text-main-dark"
            >
              Last
            </span>

            <span
              key="upcomingPayments"
              onClick={() => setTab('upcomingPayments')}
              className="cursor-pointer px-4 text-center text-sm text-main-dark"
            >
              Upcoming
            </span>
          </Tabs>

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

        <div className="flex flex-grow flex-col gap-3 overflow-y-auto pt-6">
          {(() => {
            if (tab === 'lastPayments') {
              if (view === 'category') {
                return Object.entries(transactionsByCategory).map(
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

                      <Disclosure.Panel className="flex flex-col gap-4 pl-5">
                        {record.transactions.map((transaction) => (
                          <TransactionByCategoryItemMobile
                            amount={transaction.amount}
                            date={transaction.date}
                            description={transaction.description}
                            type={transaction.type}
                            key={transaction.id}
                            handleEdit={() => {
                              setSelectedTransaction(transaction);
                              handleOpenEditTransactionModal();
                            }}
                            handleDelete={() => {
                              setSelectedTransaction(transaction);
                              handleOpenDeleteTransactionModal();
                            }}
                            recurrentTransactionId={transaction.recurrent_id}
                            spendingGroups={transaction.spending_groups}
                          />
                        ))}
                      </Disclosure.Panel>
                    </Disclosure>
                  ),
                );
              }

              return transactions.map((transaction) => (
                <TransactionItemMobile
                  amount={transaction.amount}
                  categoryName={transaction.category.name}
                  date={transaction.date}
                  description={transaction.description}
                  type={transaction.type}
                  key={transaction.id}
                  handleEdit={() => {
                    setSelectedTransaction(transaction);
                    handleOpenEditTransactionModal();
                  }}
                  handleDelete={() => {
                    setSelectedTransaction(transaction);
                    handleOpenDeleteTransactionModal();
                  }}
                  recurrentTransactionId={transaction.recurrent_id}
                  spendingGroups={transaction.spending_groups}
                />
              ));
            }

            return recurrentTransactions.map(
              (transaction) =>
                transaction.next_transaction && (
                  <div
                    key={transaction.id}
                    className="flex flex-col rounded-lg bg-white px-4 py-1 pr-2 hover:bg-gray-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex w-full flex-grow items-start justify-between">
                      <div>
                        <span className="w-full break-words text-left">
                          {transaction.category.name}
                        </span>

                        <p className="w-full break-words text-left text-sm">
                          {transaction.description}
                        </p>
                      </div>

                      <div>
                        <p className="w-full break-words text-right text-sm">
                          {format(
                            parseISO(transaction.next_transaction),
                            'EEE, dd MMM',
                          )}
                        </p>

                        <p
                          className={classNames(
                            'w-full break-words text-right',
                            transaction.type === FinancialOperationType.EXPENSE
                              ? 'text-main-orange'
                              : 'text-main-blue',
                          )}
                        >
                          {formatUSDDecimal(parseFloat(transaction.amount))}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
            );
          })()}
        </div>
      </div>

      <EditTransactionModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={() => {
          handleCloseEditTransactionModal();
        }}
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

const isReactElement = (node: ReactNode): node is ReactElement => {
  return (node as ReactElement).type !== undefined;
};

type TabsProps = {
  children: ReactNode;
  value: string;
};

const Tabs = (props: TabsProps) => {
  const [isMounted, setIsMounted] = React.useState(false);

  useMount(() => {
    setIsMounted(true);
  });

  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);
  const tabs = useRef<HTMLDivElement>(null);
  const valueToIndex = useMemo(() => new Map(), []);
  const childrenRef = useRef<RefObject<HTMLElement>[]>([]);

  let childIndex = 0;
  const children = React.Children.map(props.children, (child, index) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    if (!isReactElement(child)) {
      return child;
    }

    const childValue = child.key === undefined ? childIndex : child.key;

    valueToIndex.set(childValue, childIndex);

    if (!childrenRef.current[index]) {
      childrenRef.current[index] = React.createRef();
    }

    childIndex += 1;

    const isCurrentTab = props.value === child.key;

    return React.cloneElement(child as ReactElement, {
      ref: childrenRef.current[index],
      className: twMerge(
        child.props.className,
        isCurrentTab &&
          isMounted &&
          'text-white transition-colors duration-300',
      ),
    });
  });

  useLayoutEffect(() => {
    if (!tabs.current || !children) {
      return;
    }

    const activeTabIndex = valueToIndex.get(props.value);
    const activeTabRef = childrenRef.current[activeTabIndex];

    if (activeTabRef.current) {
      const tabRect = activeTabRef.current.getBoundingClientRect();
      const tabsRect = tabs.current.getBoundingClientRect();

      const currentLeftOffset = tabRect.left - tabsRect.left;
      setLeftOffset(currentLeftOffset);

      const currentTabWidth = tabRect.width;
      setIndicatorWidth(currentTabWidth);
    }
  }, [children, props.value, valueToIndex]);

  return (
    <div className="relative inline-block rounded-full border border-main-dark py-2">
      <div className="relative z-20 flex" ref={tabs}>
        {children}
      </div>

      {isMounted && (
        <div
          className="absolute top-0 z-10 h-full rounded-full bg-main-dark transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: indicatorWidth, left: leftOffset }}
        >
          <span className="sr-only">indicator</span>
        </div>
      )}
    </div>
  );
};
