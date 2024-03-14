import { api } from '@/shared/api/api';

import { HomePageContent } from './_ui/HomePage/HomePageContent';

const HomePage = async () => {
  const transactions = await api.transactions.getAll({
    searchParams: {
      period: 'month',
    },
  });

  const recurrentTransactions = await api.recurrentTransactions.getAll();

  return (
    <HomePageContent
      transactions={transactions}
      recurrentTransactions={recurrentTransactions}
    />
  );
};

export default HomePage;
