'use client';

import { Breakpoints, useIsBreakpoint } from '@/shared/utils/hooks';
import { Transaction } from '@/shared/types/transactionTypes';
import { RecurrentTransaction } from '@/shared/types/recurrentTransactionTypes';
import { HomePageContentDesktop } from './ui/HomePageContentDesktop';
import { HomePageContentMobile } from './ui/HomePageContentMobile';

type HomePageContentProps = {
  transactions: Transaction[];
  recurrentTransactions: RecurrentTransaction[];
};

export const HomePageContent = ({
  recurrentTransactions: initialRecurrentTransactions,
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const isDesktop = useIsBreakpoint(Breakpoints.MD);

  if (isDesktop) {
    return (
      <HomePageContentDesktop
        recurrentTransactions={initialRecurrentTransactions}
        transactions={initialTransactions}
      />
    );
  }

  return (
    <HomePageContentMobile
      recurrentTransactions={initialRecurrentTransactions}
      transactions={initialTransactions}
    />
  );
};
