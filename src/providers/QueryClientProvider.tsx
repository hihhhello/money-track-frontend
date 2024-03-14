'use client';

import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

type QueryClientProviderProps = {
  children: ReactNode;
};

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};
