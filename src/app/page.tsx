import { api } from '@/shared/api/api';
import { HomePageContent } from './_ui/HomePage/HomePageContent';
import { HomePageTransactionsTotal } from './_ui/HomePage/ui/HomePageTransactionsTotal';
import { HomePageAddNewTransactionActions } from './_ui/HomePage/ui/HomePageAddNewTransactionActions';

const HomePage = async () => {
  const transactions = await api.transactions.getAll();
  const recurrentTransactions = await api.recurrentTransactions.getAll();

  return (
    <div>
      <div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <HomePageTransactionsTotal transactions={transactions} />
        </div>

        <div className="sm:col-span-2">
          <HomePageAddNewTransactionActions />
        </div>
      </div>

      <HomePageContent
        transactions={transactions}
        recurrentTransactions={recurrentTransactions}
      />
    </div>
  );
};

export default HomePage;
