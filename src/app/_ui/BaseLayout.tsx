'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { classNames } from '@/shared/utils/helpers';
import { BarChartIcon } from '@/shared/ui/Icons/BarChartIcon';
import { FileIcon } from '@/shared/ui/Icons/FileIcon';
import { TargetIcon } from '@/shared/ui/Icons/TargetIcon';
import { UsersIcon } from '@/shared/ui/Icons/UsersIcon';
import { SettingsIcon } from '@/shared/ui/Icons/SettingsIcon';

type BaseLayoutProps = {
  children: ReactNode;
};

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    Icon: BarChartIcon,
    href: '/',
  },
  {
    title: 'Spending Plan',
    Icon: FileIcon,
    href: '/spending-plan',
  },
  {
    title: 'Saving Goals',
    Icon: TargetIcon,
    href: '/saving-goals',
  },
  {
    title: 'Linked Accounts',
    Icon: UsersIcon,
    href: '/linked-accounts',
  },
  {
    title: 'Settings',
    Icon: SettingsIcon,
    href: '/settings',
  },
];

const Sidebar = ({ pathname }: { pathname: string }) => (
  <div className="flex flex-col gap-16 rounded-br-[56px] rounded-tr-[56px] bg-main-white px-10 py-20">
    {NAVIGATION_ITEMS.map(({ Icon, title, href }) => (
      <div key={title} className="relative">
        <div
          className={classNames(
            href !== pathname && 'hidden',
            'absolute -left-[20px] top-0 h-[104px] w-[5px] transform rounded bg-[#4160EA]',
          )}
        ></div>

        <Link href={href}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={classNames(
                'rounded-full p-[22px]',
                href === pathname ? 'bg-main-dark' : 'bg-[#EAEAF5]',
              )}
            >
              <Icon
                className={classNames(
                  'h-14 w-14',
                  href === pathname && 'stroke-white',
                )}
              />
            </div>

            <span
              className={classNames(
                'whitespace-nowrap text-main-dark',
                href === pathname && 'font-bold',
              )}
            >
              {title}
            </span>
          </div>
        </Link>
      </div>
    ))}
  </div>
);

const Header = () => {
  return (
    <div className="flex justify-between">
      <h2 className="text-4.5xl">Dashboard</h2>

      <div className="flex items-center gap-8 rounded-[100px] bg-main-white py-2 pl-6 pr-2">
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
