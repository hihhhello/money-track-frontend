'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { useEnvironment } from '@/providers/EnvironmentProvider';
import { PieChartIcon } from '@/shared/icons/PieChartIcon';
import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import { SignOutIcon } from '@/shared/icons/SignOutIcon';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { UserGroupIcon } from '@/shared/icons/UserGroupIcon';

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed hidden h-full w-[112px] flex-col justify-between pb-[60px] pt-[200px] sm:flex">
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className={twMerge(
            'group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 transition-colors hover:bg-main-blue/20',
            pathname === '/' && 'bg-main-blue/20',
          )}
        >
          <PieChartIcon
            className={twMerge(
              'h-8 w-8 text-gray-600 group-hover:text-main-blue',
              pathname === '/' && 'text-main-blue',
            )}
          />

          <span className="sr-only">Dashboard</span>
        </Link>

        <Link
          href="/categories"
          className={twMerge(
            'group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 transition-colors hover:bg-main-blue/20',
            pathname === '/categories' && 'bg-main-blue/20',
          )}
        >
          <SquaresPlusIcon
            className={twMerge(
              'h-8 w-8 text-gray-600 group-hover:text-main-blue',
              pathname === '/categories' && 'text-main-blue',
            )}
          />

          <span className="sr-only">Categories</span>
        </Link>

        <Link
          href="/recurrent-transactions"
          className={twMerge(
            'group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 transition-colors hover:bg-main-blue/20',
            pathname === '/recurrent-transactions' && 'bg-main-blue/20',
          )}
        >
          <RecurrentTransactionIcon
            className={twMerge(
              'h-8 w-8 text-gray-600 group-hover:text-main-blue',
              pathname === '/recurrent-transactions' && 'text-main-blue',
            )}
          />

          <span className="sr-only">Recurrent Transactions</span>
        </Link>

        <Link
          href="/spending-groups"
          className={twMerge(
            'group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 transition-colors hover:bg-main-blue/20',
            pathname === '/spending-groups' && 'bg-main-blue/20',
          )}
        >
          <UserGroupIcon
            className={twMerge(
              'h-8 w-8 text-gray-600 group-hover:text-main-blue',
              pathname === '/spending-groups' && 'text-main-blue',
            )}
          />

          <span className="sr-only">Groups</span>
        </Link>
      </div>

      <div>
        <button
          onClick={() => signOut()}
          className="group flex w-full flex-col items-center rounded-lg py-[6px] pl-8 pr-12 transition-colors hover:bg-main-blue/20"
        >
          <SignOutIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
