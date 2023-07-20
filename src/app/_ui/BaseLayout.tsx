'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { classNames } from '@/shared/utils';

type BaseLayoutProps = {
  children: ReactNode;
};

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    Icon: ChartBarIcon,
    href: '/',
  },
  {
    title: 'Groups',
    Icon: UserGroupIcon,
    href: '/groups',
  },
  {
    title: 'Savings',
    Icon: CurrencyDollarIcon,
    href: '/savings',
  },
  {
    title: 'Settings',
    Icon: Cog8ToothIcon,
    href: '/settings',
  },
];

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-row">
      <div className="pt-32">
        <div className="flex flex-col gap-16 rounded-br-sidebar rounded-tr-sidebar bg-gray-800 py-12 pl-24 pr-12">
          {NAVIGATION_ITEMS.map(({ Icon, title, href }) => (
            <Link key={title} href={href}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={classNames(
                    'rounded-full p-4.5',
                    href === pathname ? 'bg-white' : 'bg-gray-700',
                  )}
                >
                  <div className="h-14 w-14">
                    <Icon
                      className={classNames(
                        href === pathname ? 'text-black' : 'text-gray-400',
                      )}
                    />
                  </div>
                </div>

                <span
                  className={classNames(
                    'font-bold',
                    href === pathname ? 'text-white' : 'text-gray-400',
                  )}
                >
                  {title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};
