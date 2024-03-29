'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import { format, parseISO } from 'date-fns';
import { classNames, formatUSDDecimal } from 'hihhhello-utils';
import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { SpendingGroup } from '@/shared/types/spendingGroupTypes';

type TransactionItemMobileProps = {
  categoryName: string;
  description: string | null;
  date: string;
  type: FinancialOperationTypeValue;
  amount: string;
  handleEdit: () => void;
  handleDelete: () => void;
  recurrentTransactionId?: number | null;
  spendingGroups?: SpendingGroup[];
} & JSX.IntrinsicElements['div'];

export const TransactionItemMobile = ({
  amount,
  categoryName,
  date,
  description,
  handleDelete,
  handleEdit,
  type,
  className,
  recurrentTransactionId,
  spendingGroups,
  ...divProps
}: TransactionItemMobileProps) => {
  const touchStart = useRef<null | number>(null);
  const touchEnd = useRef<null | number>(null);

  const setTouchStart = (value: number) => (touchStart.current = value);
  const setTouchEnd = (value: number) => (touchEnd.current = value);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      !touchStart.current ||
      touchStart.current - e.targetTouches[0].clientX < 0
    ) {
      return;
    }

    setTouchEnd(e.targetTouches[0].clientX);
    const diff = touchStart.current - e.targetTouches[0].clientX;

    if (diff >= 160) {
      e.currentTarget.style.transform = `translateX(-160px)`;

      return;
    }

    e.currentTarget.style.transform = `translateX(-${diff}px)`;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || !touchEnd.current) {
      return;
    }

    const coordDiff = touchStart.current - touchEnd.current;

    if (coordDiff >= 160) {
      return;
    }

    e.currentTarget.style.transform = `translateX(0px)`;
  };

  return (
    <div
      className={twMerge(
        'relative flex w-full items-center justify-between rounded-lg',
        className,
      )}
    >
      <div
        className={twMerge(
          'z-30 flex h-full w-full flex-grow touch-pan-y flex-col rounded-lg bg-white px-2 py-2 transition-transform duration-300',
          !isEmpty(spendingGroups) && 'pt-4',
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          e.currentTarget.style.transform = `translateX(0px)`;
        }}
        {...divProps}
      >
        <div className="absolute left-0 top-0 z-40 flex -translate-y-1/2 translate-x-4 gap-1">
          {spendingGroups?.map((group) => (
            <span
              key={group.id}
              className="rounded-md bg-main-blue px-2 text-sm  text-white"
            >
              {group.name}
            </span>
          ))}
        </div>

        <div className="flex w-full items-start justify-between">
          <div className="flex max-w-[140px] flex-1 flex-col overflow-hidden">
            <span className="overflow-hidden text-ellipsis text-left">
              {categoryName}
            </span>

            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
              {description}
            </p>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-end gap-1">
              <div>
                {recurrentTransactionId && (
                  <RecurrentTransactionIcon className="text-main-blue" />
                )}
              </div>

              <p className="break-words text-right text-sm">
                {format(parseISO(date), 'EEE, dd MMM')}
              </p>
            </div>

            <p
              className={classNames(
                'w-full break-words text-right',
                type === FinancialOperationType.EXPENSE
                  ? 'text-main-orange'
                  : 'text-main-blue',
              )}
            >
              {formatUSDDecimal(parseFloat(amount))}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 z-10 flex h-full w-full justify-end overflow-hidden rounded-lg">
        <div className="flex-1 bg-main-blue/10"></div>

        <button
          onClick={handleEdit}
          className={classNames(
            'z-20 flex w-[80px] flex-col items-center justify-center gap-2 bg-main-blue/10 px-4 py-2',
          )}
        >
          <PencilIcon className="h-8 w-8 text-main-blue" />

          <span className="text-sm text-main-blue">Edit</span>
        </button>

        <button
          onClick={handleDelete}
          className="z-20 flex w-[80px] flex-col items-center justify-center gap-2 bg-main-orange/10 px-4 py-2"
        >
          <TrashIcon className="h-8 w-8 text-main-orange" />

          <span className="text-sm text-main-orange">Delete</span>
        </button>
      </div>
    </div>
  );
};
