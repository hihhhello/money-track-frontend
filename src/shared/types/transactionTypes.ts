import { DatePeriodKeyword } from '../utils/dateUtils';
import { FinancialOperationTypeValue } from './globalTypes';

export type Transaction = {
  amount: string;
  category: {
    id: number;
    name: string;
  };
  spending_groups: Array<{
    id: number;
    name: string;
    description: string | null;
  }>;
  description: string | null;
  date: string;
  id: number;
  timestamp: string;
  type: FinancialOperationTypeValue;
  user_id: number;
  recurrent_id: number | null;
};

export type APITransactionPeriodFilter = 'today' | 'month' | 'year';

export const TransactionPeriodFilter = {
  ...DatePeriodKeyword,
  ALL: 'all',
} as const;

export type TransactionPeriodFilterType =
  (typeof TransactionPeriodFilter)[keyof typeof TransactionPeriodFilter];

export type TransactionsByCategory = {
  [category: string]: {
    transactions: Transaction[];
    totalAmount: number;
    type: FinancialOperationTypeValue;
  };
};

export const TransactionCreationStep = {
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  SELECT_GROUP: 'SELECT_GROUP',
} as const;

export type TransactionCreationStepType =
  (typeof TransactionCreationStep)[keyof typeof TransactionCreationStep];
