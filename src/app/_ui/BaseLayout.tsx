'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { classNames } from '@/shared/utils/helpers';
import { CloudIcon } from '@/shared/ui/Icons/CloudIcon';

type BaseLayoutProps = {
  children: ReactNode;
};

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/',
  },
  {
    title: 'Spending Plan',
    href: '/spending-plan',
  },
  {
    title: 'Saving Goals',
    href: '/saving-goals',
  },
  {
    title: 'Linked Accounts',
    href: '/linked-accounts',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
];

const Header = ({ pathname }: { pathname: string }) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-1">
        <div className="flex-center h-14 w-14 rounded-full bg-main-blue">
          <CloudIcon />
        </div>

        <div className="flex rounded-[100px] bg-main-white">
          {NAVIGATION_ITEMS.map(({ title, href }) => (
            <div
              key={title}
              className={classNames(
                'flex-center rounded-[100px] px-6',
                href === pathname && 'bg-main-dark',
              )}
            >
              <Link href={href}>
                <span
                  className={classNames(
                    'whitespace-nowrap text-sm text-main-dark ',
                    href === pathname && 'text-white',
                  )}
                >
                  {title}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8 rounded-[100px] bg-main-white py-1 pl-6 pr-2">
        <BellIcon className="h-6 w-6" />

        <div className="h-12 w-12 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const pathname = usePathname();

  return (
    <main className="container mx-auto px-[120px]">
      <div className="pt-8">
        <Header pathname={pathname} />
      </div>

      <div className="mt-10">{children}</div>
    </main>
  );
};
