'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  Cog8ToothIcon,
  BellIcon,
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

const Sidebar = ({ pathname }: { pathname: string }) => (
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
            <Icon
              className={classNames(
                'h-14 w-14',
                href === pathname ? 'text-black' : 'text-gray-400',
              )}
            />
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
);

const Header = () => {
  return (
    <div className="flex justify-between">
      <h2 className="text-4.5xl">Hello, Jim!</h2>

      <div className="flex items-center gap-8 rounded-sidebar bg-gray-700 py-2 pl-6 pr-2">
        <BellIcon className="h-6 w-6" />

        <div className="h-12 w-12 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-row">
      <div className="pt-32">
        <Sidebar pathname={pathname} />
      </div>

      <main className="container pl-20 pr-36">
        <div className="pt-8">
          <Header />
        </div>

        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
};
