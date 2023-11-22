export type Transaction = {
  amount: string;
  category: {
    id: number;
    type: 'expense' | 'deposit';
    name: string;
  };
  date: string;
  id: number;
  timestamp: string;
  type: 'expense' | 'deposit';
  user_id: number;
};
