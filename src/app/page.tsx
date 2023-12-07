import { api } from '@/shared/api/api';
import { HomePageContent } from './_ui/HomePage/HomePageContent';
import { HomePageTransactionsTotal } from './_ui/HomePage/ui/HomePageTransactionsTotal';
import { HomePageAddNewTransactionActions } from './_ui/HomePage/ui/HomePageAddNewTransactionActions';

const HomePage = async () => {
  const transactions = await api.transactions.getAll();
  const recurrentTransactions = await api.recurrentTransactions.getAll();

  return (
    <div>
      <div className="mb-4">
        <HomePageTransactionsTotal transactions={transactions} />

        <HomePageAddNewTransactionActions />
      </div>

      <HomePageContent
        transactions={transactions}
        recurrentTransactions={recurrentTransactions}
      />
    </div>
  );
};

export default HomePage;
