import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { Sidebar } from './Sidebar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return (
    <div className="h-full bg-main-paper">
      <div className="flex h-full">
        <Sidebar />

        <div className="flex-1 pl-[112px]">
          <div className="p-6">
            <main className="container mx-auto rounded-[40px] bg-white">
              <div className="p-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
