import { FinancialOperationTypeValue } from './globalTypes';

export type RecurrentTransaction = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  type: FinancialOperationTypeValue;
  frequency: RecurrentTransactionFrequencyValue;
  next_transaction: string | null;
  timestamp: string;
  amount: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
};

export const RecurrentTransactionFrequency = {
  MONTHLY: 'monthly',
  WEEKLY: 'weekly',
} as const;

export type RecurrentTransactionFrequencyValue =
  (typeof RecurrentTransactionFrequency)[keyof typeof RecurrentTransactionFrequency];
