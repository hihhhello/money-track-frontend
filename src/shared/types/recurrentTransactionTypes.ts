import { FinancialOperationTypeValue } from './globalTypes';

export type RecurrentTransaction = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  type: FinancialOperationTypeValue;
  frequency: 'weekly';
  next_transaction: string;
  timestamp: string;
  amount: string;
  description: string;
  start_date: string;
  end_date: string;
};

export type RecurrentTransactionFrequencyValue =
  (typeof RecurrentTransactionFrequency)[keyof typeof RecurrentTransactionFrequency];

export const RecurrentTransactionFrequency = {
  WEEKLY: 'weekly',
} as const;
