import { api } from '@/shared/api/api';
import { HomePageContent } from './_ui/HomePageContent';

const HomePage = async () => {
  const transactions = await api.transactions.getAll();
  const recurrentTransactions = await api.recurrentTransactions.getAll();

  return (
    <HomePageContent
      transactions={transactions}
      recurrentTransactions={recurrentTransactions}
    />
  );
};

export default HomePage;
