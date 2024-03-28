'use client';

import { HomeIcon } from '@heroicons/react/24/solid';
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
            'group flex w-full flex-col items-center hover:text-main-blue rounded-lg text-gray-600 py-2 px-8 transition-colors hover:bg-main-blue/20',
            pathname === '/' && 'bg-main-blue/20 text-main-blue',
          )}
        >
          <HomeIcon className="h-8 w-8" />

          <span className="text-sm">Home</span>
        </Link>

        <Link
          href="/categories"
          className={twMerge(
            'group flex w-full flex-col items-center text-gray-600 rounded-lg hover:text-main-blue py-2 px-8 transition-colors hover:bg-main-blue/20',
            pathname === '/categories' && 'bg-main-blue/20 text-main-blue',
          )}
        >
          <SquaresPlusIcon className="h-8 w-8" />

          <span className="text-sm">Categories</span>
        </Link>

        <Link
          href="/recurrent-transactions"
          className={twMerge(
            'group flex w-full flex-col items-center text-gray-600 hover:text-main-blue rounded-lg py-2 px-8 transition-colors hover:bg-main-blue/20',
            pathname === '/recurrent-transactions' &&
              'bg-main-blue/20 text-main-blue',
          )}
        >
          <RecurrentTransactionIcon className="h-8 w-8" />

          <span className="text-sm">Recurrent</span>
        </Link>

        <Link
          href="/spending-groups"
          className={twMerge(
            'group flex w-full flex-col items-center rounded-lg text-gray-600 hover:text-main-blue py-2 px-8 transition-colors hover:bg-main-blue/20',
            pathname === '/spending-groups' && 'bg-main-blue/20 text-main-blue',
          )}
        >
          <UserGroupIcon className="h-8 w-8" />

          <span className="text-sm">Groups</span>
        </Link>
      </div>

      <div>
        <button
          onClick={() => signOut()}
          className="group flex w-full flex-col items-center rounded-lg py-[6px] px-8 transition-colors hover:bg-main-blue/20"
        >
          <SignOutIcon className="h-8 w-8 text-gray-600 group-hover:text-main-blue" />

          <span className="sr-only">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
