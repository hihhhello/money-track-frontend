'use client';

import { Fragment } from 'react';

import { classNames } from 'hihhhello-utils';
import {
  TransactionPeriodFilter,
  TransactionPeriodFilterType,
} from '@/shared/types/transactionTypes';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { upperFirst } from 'lodash';
import { ChevronDownIcon } from '@/shared/icons/ChevronDownIcon';

type TransactionsPeriodFilterSelectProps = {
  filter: TransactionPeriodFilterType;
  handleChangeFilter: (newFilter: TransactionPeriodFilterType) => void;
};

export const TransactionsPeriodFilterSelect = ({
  filter,
  handleChangeFilter,
}: TransactionsPeriodFilterSelectProps) => {
  return (
    <Listbox value={filter} onChange={handleChangeFilter}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative min-w-[110px] cursor-pointer rounded-full border border-main-blue bg-main-blue px-4 py-1.5 text-left text-white sm:min-w-[144px]">
              <span className="flex items-center">
                <span className="block truncate text-sm sm:text-base">
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
              <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.values(TransactionPeriodFilter).map((period) => (
                  <Listbox.Option
                    key={period}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-main-blue text-white' : 'text-gray-900',
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
                              selected ? 'font-semibold' : 'font-normal',
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
  );
};
