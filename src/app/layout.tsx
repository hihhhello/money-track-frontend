import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';

import { BaseLayout } from '@/app/_ui/BaseLayout';
import { QueryClientProvider } from '@/features/QueryClientProvider';
import { classNames } from '@/shared/utils/helpers';
import { NextAuthProvider } from '@/features/NextAuthProvider';
import { ToastContainer } from 'react-toastify';

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
          <NextAuthProvider>
            <ToastContainer />

            <BaseLayout>{children}</BaseLayout>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
