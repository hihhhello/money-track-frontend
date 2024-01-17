'use client';

import { format, parseISO } from 'date-fns';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import React, {
  Fragment,
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
import { Menu, Transition } from '@headlessui/react';
import { ThreeDotsVerticalIcon } from '@/shared/icons/ThreeDotsVerticalIcon';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { api } from '@/shared/api/api';
import { useQueryClient } from '@tanstack/react-query';

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

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [tab, setTab] = useState<'lastPayments' | 'upcomingPayments'>(
    'lastPayments',
  );

  const handleDeleteTransaction = (transactionId: number) => {
    const toastId = loadingToast.showLoading('Deleting your transaction...');

    return api.transactions
      .deleteOne({
        params: {
          transactionId,
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
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  return (
    <div>
      <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
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

        <div className="flex h-full flex-col gap-4 overflow-y-auto">
          {tab === 'lastPayments'
            ? transactions.map((transaction) => (
                <button
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-1 pr-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col">
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
                        {formatToUSDCurrency(parseFloat(transaction.amount))}
                      </p>
                    </div>
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
                                  onClick={() =>
                                    handleDeleteTransaction(transaction.id)
                                  }
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
                </button>
              ))
            : recurrentTransactions.map((transaction) => (
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
                    <span
                      className={classNames(
                        'w-full break-words text-left',
                        transaction.type === FinancialOperationType.EXPENSE
                          ? 'text-main-orange'
                          : 'text-main-blue',
                      )}
                    >
                      {formatToUSDCurrency(parseFloat(transaction.amount))}
                    </span>
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
