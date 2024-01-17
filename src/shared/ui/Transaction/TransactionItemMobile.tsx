'use client';

import { format, parseISO } from 'date-fns';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import React from 'react';

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
}: TransactionItemMobileProps) => (
  <div
    className={twMerge(
      'relative flex min-h-[120px] items-center justify-between overflow-hidden rounded-lg',
      className,
    )}
  >
    <div
      className="z-30 flex h-full min-h-[120px] w-full touch-pan-y flex-col rounded-lg bg-white px-4 py-2 pr-2 transition-transform duration-300"
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
          {formatToUSDCurrency(parseFloat(amount))}
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
