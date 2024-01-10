'use client';

import { useEnvironment } from '@/providers/EnvironmentProvider';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import { PieChartIcon } from '@/shared/icons/PieChartIcon';
import { SignOutIcon } from '@/shared/icons/SignOutIcon';

export const Sidebar = () => {
  const { settingsSidebar } = useEnvironment();

  return (
    <div className="hidden w-[112px] flex-col justify-between pb-[60px] pt-[200px] sm:flex">
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

      <div>
        <button
          onClick={() => signOut()}
          className="group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 hover:bg-main-blue/20"
        >
          <SignOutIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
