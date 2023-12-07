import { api } from '@/shared/api/api';
import { RecurrentTransactionsPageContent } from './_ui/RecurrentTransactionsPageContent';

const RecurrentTransactionsPage = async () => {
  const recurrentTransactions = await api.recurrentTransactions.getAll();

  return (
    <RecurrentTransactionsPageContent
      recurrentTransactions={recurrentTransactions}
    />
  );
};

export default RecurrentTransactionsPage;
