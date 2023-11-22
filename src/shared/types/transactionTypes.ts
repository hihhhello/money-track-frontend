export type Transaction = {
  amount: string;
  category: {
    id: number;
    name: string;
  };
  description: string | null;
  date: string;
  id: number;
  timestamp: string;
  type: 'expense' | 'deposit';
  user_id: number;
};
