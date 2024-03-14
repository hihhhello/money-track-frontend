import { classNames } from 'hihhhello-utils';
import type { Metadata, Viewport } from 'next';
import { Kanit } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BaseLayout } from '@/app/_ui/BaseLayout';
import { EnvironmentProvider } from '@/providers/EnvironmentProvider';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

import './globals.css';

const kanit = Kanit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Money Track',
  description: 'Created by Ratushniak family',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={classNames('h-full', kanit.className)} lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="h-full bg-white text-main-dark sm:bg-main-paper">
        <QueryClientProvider>
          <NextAuthProvider>
            <ToastContainer
              pauseOnFocusLoss={false}
              pauseOnHover={false}
              autoClose={1500}
            />

            <EnvironmentProvider>
              <BaseLayout>{children}</BaseLayout>
            </EnvironmentProvider>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
