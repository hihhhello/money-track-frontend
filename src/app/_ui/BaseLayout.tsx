import { ReactNode } from 'react';
import { Navbar } from './Navbar';

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = async ({ children }: BaseLayoutProps) => {
  return (
    <div>
      <Navbar />

      <div className="px-4 sm:px-[120px]">
        <main className="container mx-auto">
          <div className="pt-2 sm:pt-10">{children}</div>
        </main>
      </div>
    </div>
  );
};
