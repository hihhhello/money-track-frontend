'use client';

import { format, parseISO } from 'date-fns';

import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import React, { useState } from 'react';

import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

type TransactionItemMobileProps = {
  categoryName: string;
  description: string | null;
  date: string;
  type: FinancialOperationTypeValue;
  amount: string;
  handleEdit: () => void;
  handleDelete: () => void;
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
  ...divProps
}: TransactionItemMobileProps) => {
  const [touchStart, setTouchStart] = useState<null | number>(null);
  const [touchEnd, setTouchEnd] = useState<null | number>(null);

  const clearTouch = () => {
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || touchStart - e.targetTouches[0].clientX < 0) {
      return;
    }

    setTouchEnd(e.targetTouches[0].clientX);
    const diff = touchStart - e.targetTouches[0].clientX;

    if (diff >= 160) {
      e.currentTarget.style.transform = `translateX(-160px)`;

      clearTouch();

      return;
    }

    e.currentTarget.style.transform = `translateX(-${diff}px)`;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || !touchEnd) {
      return;
    }

    const coordDiff = touchStart - touchEnd;

    if (coordDiff >= 160) {
      clearTouch();

      return;
    }

    e.currentTarget.style.transform = `translateX(0px)`;
  };

  return (
    <div
      className={twMerge(
        'relative flex min-h-[120px] items-center justify-between overflow-hidden rounded-lg',
        className,
      )}
    >
      <div
        className="z-30 flex h-full min-h-[120px] w-full touch-pan-y flex-col rounded-lg bg-white px-4 py-2 pr-2 transition-transform duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          e.currentTarget.style.transform = `translateX(0px)`;
        }}
        {...divProps}
      >
        <div className="flex w-full flex-grow flex-col items-start">
          <span className="w-full break-words text-left">{categoryName}</span>

          <p className="w-full break-words text-left text-sm">{description}</p>

          <p className="w-full break-words text-left text-sm">
            {format(parseISO(date), 'EEEE, dd MMMM')}
          </p>
        </div>

        <div className="w-full flex-grow">
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

      <div className="absolute right-0 z-10 flex min-h-[120px] w-full justify-end">
        <div className="flex-1 bg-main-blue/10"></div>

        <button
          onClick={handleEdit}
          className={classNames(
            'z-20 flex w-[80px] flex-col items-center justify-center gap-2 bg-main-blue/10 px-4 py-2',
          )}
        >
          <PencilIcon className="h-5 w-5 text-main-blue" />

          <span className="text-main-blue">Edit</span>
        </button>

        <button
          onClick={handleDelete}
          className="z-20 flex w-[80px] flex-col items-center justify-center gap-2 bg-main-orange/10 px-4 py-2"
        >
          <TrashIcon className="h-5 w-5 text-main-orange" />

          <span className="text-main-orange">Delete</span>
        </button>
      </div>
    </div>
  );
};
