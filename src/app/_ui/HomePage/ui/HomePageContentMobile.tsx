'use client';

import { format, parseISO } from 'date-fns';

import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { twMerge } from 'tailwind-merge';
import { TransactionsPeriodFilterSelect } from '@/features/TransactionsPeriodFilterSelect';
import { api } from '@/shared/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { TransactionItemMobile } from '@/shared/ui/Transaction/TransactionItemMobile';
import { DeleteConfirmationModal } from '@/shared/ui/DeleteConfirmationModal';

type HomePageContentMobileProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
  filter: TransactionPeriodFilter;
  handleChangeFilter: (newFilter: TransactionPeriodFilter) => void;
};

export const HomePageContentMobile = ({
  recurrentTransactions,
  transactions,
  filter,
  handleChangeFilter,
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
    <div className="flex flex-grow overflow-hidden">
      <div className="flex flex-grow flex-col overflow-hidden rounded-3xl bg-main-paper p-3">
        <div className="mb-6 flex items-center justify-between">
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

          <TransactionsPeriodFilterSelect
            filter={filter}
            handleChangeFilter={handleChangeFilter}
          />
        </div>

        <div className="flex flex-grow flex-col gap-3 overflow-y-auto">
          {tab === 'lastPayments'
            ? transactions.map((transaction) => (
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
                />
              ))
            : recurrentTransactions.map((transaction) => (
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
              ))}
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
        isCurrentTab && 'text-white transition-colors duration-300',
      ),
    });
  });

  useEffect(() => {
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

      <div
        className="absolute top-0 z-10 h-full rounded-full bg-main-dark transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: indicatorWidth, left: leftOffset }}
      >
        <span className="sr-only">indicator</span>
      </div>
    </div>
  );
};
