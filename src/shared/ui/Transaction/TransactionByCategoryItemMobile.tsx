'use client';

import { format, parseISO } from 'date-fns';

import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import React, { useRef } from 'react';

import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';

type TransactionByCategoryItemMobileProps = {
  description: string | null;
  date: string;
  type: FinancialOperationTypeValue;
  amount: string;
  handleEdit: () => void;
  handleDelete: () => void;
  recurrentTransactionId?: number | null;
} & JSX.IntrinsicElements['div'];

export const TransactionByCategoryItemMobile = ({
  amount,
  date,
  description,
  handleDelete,
  handleEdit,
  type,
  className,
  recurrentTransactionId,
  ...divProps
}: TransactionByCategoryItemMobileProps) => {
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
        className="z-30 flex h-full w-full flex-grow touch-pan-y flex-col rounded-lg bg-white px-2 py-2 transition-transform duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          e.currentTarget.style.transform = `translateX(0px)`;
        }}
        {...divProps}
      >
        <div className="flex w-full flex-grow items-center justify-between">
          <p
            className={classNames(
              'w-full break-words text-left',
              type === FinancialOperationType.EXPENSE
                ? 'text-main-orange'
                : 'text-main-blue',
            )}
          >
            {formatUSDDecimal(parseFloat(amount))}
          </p>

          <p className="w-full break-words text-left text-sm">{description}</p>

          <div className="flex w-full items-center justify-end gap-1">
            <div>
              {recurrentTransactionId && (
                <RecurrentTransactionIcon className="text-main-blue" />
              )}
            </div>

            <p className="break-words text-right text-sm">
              {format(parseISO(date), 'EEE, dd MMM')}
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
