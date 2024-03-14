'use client';

import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import { ThreeDotsVerticalIcon } from '@/shared/icons/ThreeDotsVerticalIcon';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';
import { SpendingGroup } from '@/shared/types/spendingGroupTypes';
import { Menu, Transition } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import { format, parseISO } from 'date-fns';
import { classNames, formatUSDDecimal } from 'hihhhello-utils';
import { isEmpty } from 'lodash';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

type TransactionItemDesktopProps = {
  categoryName: string;
  description: string | null;
  date: string;
  type: FinancialOperationTypeValue;
  amount: string;
  handleEdit?: () => void;
  handleDelete?: () => void;
  recurrentTransactionId?: number | null;
  spendingGroups?: SpendingGroup[];
} & JSX.IntrinsicElements['div'];

export const TransactionItemDesktop = ({
  amount,
  categoryName,
  date,
  description,
  type,
  handleDelete,
  handleEdit,
  className,
  recurrentTransactionId,
  spendingGroups,
  ...divProps
}: TransactionItemDesktopProps) => {
  return (
    <div
      className={twMerge(
        'relative flex flex-col rounded-lg bg-white px-4 py-1 pr-2 sm:flex-row sm:items-center sm:justify-between',
        !isEmpty(spendingGroups) && 'pt-4',
        className,
      )}
      {...divProps}
    >
      <div className="absolute left-0 top-0 flex -translate-y-1/2 translate-x-4 gap-1">
        {spendingGroups?.map((group) => (
          <span
            key={group.id}
            className="rounded-md bg-main-blue px-2 text-sm  text-white"
          >
            {group.name}
          </span>
        ))}
      </div>

      <div className="flex w-full flex-grow items-start justify-between">
        <div>
          <span className="w-full break-words text-left">{categoryName}</span>

          <p className="w-full break-words text-left text-sm">{description}</p>
        </div>

        <div>
          <div className="flex items-center gap-1">
            <div>
              {recurrentTransactionId && (
                <RecurrentTransactionIcon className="text-main-blue" />
              )}
            </div>

            <p className="w-full break-words text-left text-sm">
              {format(parseISO(date), 'EEE, dd MMM')}
            </p>
          </div>

          <p
            className={classNames(
              'w-full break-words text-left sm:text-right',
              type === FinancialOperationType.EXPENSE
                ? 'text-main-orange'
                : 'text-main-blue',
            )}
          >
            {formatUSDDecimal(parseFloat(amount))}
          </p>
        </div>
      </div>

      {(handleEdit || handleDelete) && (
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
                  {handleEdit && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleEdit}
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
                  )}

                  {handleDelete && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleDelete}
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
                  )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      )}
    </div>
  );
};
