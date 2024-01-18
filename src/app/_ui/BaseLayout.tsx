import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { Sidebar } from './Sidebar';
import { classNames } from '@/shared/utils/helpers';
import { Navbar } from './Navbar/Navbar';

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
            'w-full flex-1',
            isSignedInUser && 'sm:pl-[112px]',
          )}
        >
          <div className="min-h-full p-6">
            {isSignedInUser && (
              <div className="mb-6 flex justify-end">
                <Navbar />
              </div>
            )}

            <main className="container mx-auto h-full rounded-[40px] bg-white">
              <div className="min-h-full sm:p-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
