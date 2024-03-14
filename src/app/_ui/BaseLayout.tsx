import { classNames } from 'hihhhello-utils';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';

import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  const isSignedInUser = Boolean(session?.user);

  return (
    <div className="h-full bg-white sm:bg-main-paper">
      <div className="flex h-full">
        {isSignedInUser && <Sidebar />}

        <div
          className={classNames(
            'flex w-full',
            isSignedInUser && 'sm:pl-[112px]',
          )}
        >
          <div className="flex flex-1 flex-col p-6">
            {isSignedInUser && <Navbar />}

            <main className="container mx-auto flex flex-grow overflow-y-hidden bg-white sm:rounded-[40px]">
              <div className="flex flex-1 sm:p-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
