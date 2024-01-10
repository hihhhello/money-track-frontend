'use client';

import { useEnvironment } from '@/providers/EnvironmentProvider';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { XMarkIcon } from '@/shared/icons/XMarkIcon';
import { Dialog, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import { PieChartIcon } from '@/shared/icons/PieChartIcon';

export const Sidebar = () => {
  const { settingsSidebar } = useEnvironment();

  return (
    <div className="flex flex-col justify-between pt-[200px]">
      <div className="flex flex-col items-center gap-2">
        <Link
          onClick={settingsSidebar.handleClose}
          href="/"
          className="group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 hover:bg-main-blue/20"
        >
          <PieChartIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Dashboard</span>
        </Link>

        <Link
          onClick={settingsSidebar.handleClose}
          href="/categories"
          className="group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 hover:bg-main-blue/20"
        >
          <SquaresPlusIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Categories</span>
        </Link>

        <Link
          onClick={settingsSidebar.handleClose}
          href="/recurrent-transactions"
          className="group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 hover:bg-main-blue/20"
        >
          <RecurrentTransactionIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Recurrent Transactions</span>
        </Link>
      </div>

      <div className="px-4 sm:px-6">
        <button
          onClick={() => signOut()}
          className="w-full rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
