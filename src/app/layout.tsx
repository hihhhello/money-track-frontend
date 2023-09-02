import './globals.css';

import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';

import { BaseLayout } from '@/app/_ui/BaseLayout';
import { QueryClientProvider } from '@/features/QueryClientProvider';
import { classNames } from '@/shared/utils/helpers';

const kanit = Kanit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

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
    <html className={classNames('h-full', kanit.className)} lang="en">
      <body className="h-full bg-white text-main-dark">
        <QueryClientProvider>
          <BaseLayout>{children}</BaseLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
