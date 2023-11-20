import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { SettingsSidebar } from './SettingsSidebar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  return (
    <div>
      {session?.user && <Navbar />}

      <div className="px-4 sm:px-[120px]">
        <main className="container mx-auto">
          <div className="pt-2 sm:pt-10">{children}</div>
        </main>
      </div>

      <SettingsSidebar />
    </div>
  );
};
