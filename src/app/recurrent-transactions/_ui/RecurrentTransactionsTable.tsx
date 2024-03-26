import { Menu, Transition } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { format, parseISO } from 'date-fns';
import { classNames, formatUSDDecimal } from 'hihhhello-utils';
import { upperFirst } from 'lodash';
import { Fragment } from 'react';

import { ThreeDotsVerticalIcon } from '@/shared/icons/ThreeDotsVerticalIcon';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';

type RecurrentTransactionsTableProps = {
  recurrentTransactions: RecurrentTransaction[];
  handleEditTransaction: (transaction: RecurrentTransaction) => void;
};

export const RecurrentTransactionsTable = ({
  recurrentTransactions,
  handleEditTransaction,
}: RecurrentTransactionsTableProps) => (
  <div className="relative rounded-3xl">
    <table className="relative min-w-full rounded-3xl bg-main-paper">
      <thead className="sticky top-0 z-10 bg-main-paper overflow-auto">
        <tr>
          <th
            scope="col"
            className="text-text-dark py-3.5 pl-6 pr-3 text-left text-sm font-semibold rounded-tl-3xl"
          >
            Type
          </th>

          <th
            scope="col"
            className="focus-primary-green text-main-dark cursor-pointer px-3 py-3.5 text-left text-sm font-semibold"
            tabIndex={0}
          >
            Amount
          </th>

          <th
            scope="col"
            className="focus-primary-green text-main-dark cursor-pointer px-3 py-3.5 text-left text-sm font-semibold"
            tabIndex={0}
          >
            Category
          </th>

          <th
            scope="col"
            className="focus-primary-green text-main-dark cursor-pointer px-3 py-3.5 text-left text-sm font-semibold"
            tabIndex={0}
          >
            Description
          </th>

          <th
            scope="col"
            className="text-main-dark px-3 py-3.5 text-left text-sm font-semibold"
          >
            Next Transaction
          </th>

          <th
            scope="col"
            className="text-main-dark px-3 py-3.5 text-left text-sm font-semibold"
          >
            Start Date
          </th>

          <th
            scope="col"
            className="text-main-dark px-3 py-3.5 text-left text-sm font-semibold"
          >
            End Date
          </th>

          <th
            scope="col"
            className="text-main-dark px-3 py-3.5 text-left text-sm font-semibold rounded-tr-3xl"
          >
            Frequency
          </th>

          <th scope="col" className="py-3.5 pl-3 pr-4 rounded-tr-3xl">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {recurrentTransactions.map((transaction) => {
          return (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap py-2 pl-6 pr-3 text-sm">
                {upperFirst(transaction.type)}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {formatUSDDecimal(parseFloat(transaction.amount))}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {transaction.category.name}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {transaction.description}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {format(parseISO(transaction.next_transaction), 'EEE, dd MMM')}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {format(parseISO(transaction.start_date), 'dd MMM yyyy')}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {transaction.end_date
                  ? format(parseISO(transaction.end_date), 'dd MMM yyyy')
                  : 'None'}
              </td>

              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {upperFirst(transaction.frequency)}
              </td>

              <td className="whitespace-nowrap rounded-r-md px-3 py-2 pr-4 text-sm">
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
                                  handleEditTransaction(transaction);
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
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
