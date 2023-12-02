import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';

import { BaseLayout } from '@/app/_ui/BaseLayout';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { classNames } from '@/shared/utils/helpers';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { ToastContainer } from 'react-toastify';
import { EnvironmentProvider } from '@/providers/EnvironmentProvider';

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
      {/* <head>
        <link rel="manifest" href="/manifest.json" />
      </head> */}

      <body className="h-full bg-white text-main-dark">
        <QueryClientProvider>
          <NextAuthProvider>
            <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />

            <EnvironmentProvider>
              <BaseLayout>{children}</BaseLayout>
            </EnvironmentProvider>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
