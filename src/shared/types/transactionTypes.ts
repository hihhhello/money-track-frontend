import { FinancialOperationTypeValue } from './globalTypes';

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
  type: FinancialOperationTypeValue;
  user_id: number;
};

export type APITransactionPeriodFilter = 'today' | 'month' | 'year';
export type TransactionPeriodFilter = 'today' | 'month' | 'year' | 'all';

export type TransactionsByCategory = {
  [category: string]: {
    transactions: Transaction[];
    totalAmount: number;
    type: FinancialOperationTypeValue;
  };
};
