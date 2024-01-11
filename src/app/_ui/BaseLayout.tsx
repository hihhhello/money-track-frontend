import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { Sidebar } from './Sidebar';
import { classNames } from '@/shared/utils/helpers';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return (
    <div className="h-full bg-main-paper">
      <div className="flex h-full">
        {session?.user && <Sidebar />}

        <div
          className={classNames(
            'flex-1',
            Boolean(session?.user) && 'sm:pl-[112px]',
          )}
        >
          <div className="min-h-full p-6">
            <main className="container mx-auto h-full rounded-[40px] bg-white">
              <div className="min-h-full p-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
