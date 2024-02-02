'use client';

import { classNames } from 'hihhhello-utils';
import { addDays, format, subDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type TransactionsDayFilterProps = {
  value: Date;
  handleChange: (newDate: Date) => void;
};

export const TransactionsDayFilter = ({
  handleChange,
  value,
}: TransactionsDayFilterProps) => {
  return (
    <div className="relative flex min-w-[110px] items-center justify-between rounded-full border border-main-blue bg-main-blue px-2 py-1.5 text-left text-white sm:min-w-[144px]">
      <button onClick={() => handleChange(subDays(value, 1))}>
        <ChevronLeftIcon
          className={classNames('h-5 w-5 text-white')}
          aria-hidden="true"
        />
      </button>

      <span className="flex items-center">
        <span className="block truncate text-sm sm:text-base">
          {format(value, 'dd MMM yyyy')}
        </span>
      </span>

      <button onClick={() => handleChange(addDays(value, 1))}>
        <ChevronRightIcon
          className={classNames('h-5 w-5 text-white')}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};
