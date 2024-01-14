'use client';

import { Fragment, useState } from 'react';
import { format, parseISO } from 'date-fns';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { useBoolean } from '@/shared/utils/hooks';
import {
  Transaction,
  TransactionPeriodFilter,
} from '@/shared/types/transactionTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { EditTransactionModal } from '@/features/EditTransactionModal';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { Listbox, Menu, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { upperFirst } from 'lodash';
import { ChevronDownIcon } from '@/shared/icons/ChevronDownIcon';

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
  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Last payments</span>
            </div>

            <Listbox value={filter} onChange={handleChangeFilter}>
              {({ open }) => (
                <>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full min-w-[144px] cursor-pointer rounded-full border border-main-blue bg-main-blue py-2 pl-4 pr-4 text-left text-white">
                      <span className="flex items-center">
                        <span className="block truncate">
                          {upperFirst(filter)}
                        </span>
                      </span>

                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronDownIcon
                          className={classNames(
                            'h-5 w-5 text-white transition-transform',
                            open && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {['all', 'today', 'month', 'year'].map((period) => (
                          <Listbox.Option
                            key={period}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? 'bg-main-blue text-white'
                                  : 'text-gray-900',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )
                            }
                            value={period}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'ml-3 block truncate',
                                    )}
                                  >
                                    {upperFirst(period)}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-main-blue',
                                      'absolute inset-y-0 right-0 flex items-center pr-4',
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {transactions.map((transaction) => (
              <button
                onClick={() => {
                  setSelectedTransaction(transaction);
                  handleOpenEditTransactionModal();
                }}
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
              </button>
            ))}
          </div>
        </div>

        <div className="flex max-h-[715px] flex-col rounded-3xl bg-main-paper p-4">
          <div className="mb-6">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Upcoming payments</span>
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
                  <span
                    className={classNames(
                      'w-full break-words text-left sm:text-right',
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
