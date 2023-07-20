import './globals.css';

import type { Metadata } from 'next';

import { QueryClientProvider } from '@/features/QueryClientProvider';
import { BaseLayout } from '@/app/_ui/BaseLayout';

export const metadata: Metadata = {
  title: 'Money Track',
  description: 'Created by Anton',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark h-full" lang="en">
      <body className="h-full dark:bg-black dark:text-white">
        <QueryClientProvider>
          <BaseLayout>{children}</BaseLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
