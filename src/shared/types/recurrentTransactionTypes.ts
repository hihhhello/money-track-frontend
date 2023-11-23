import { FinancialOperationTypeValue } from './globalTypes';

export type RecurrentTransaction = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  type: FinancialOperationTypeValue;
  frequency: RecurrentTransactionFrequencyValue;
  next_transaction: string;
  timestamp: string;
  amount: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};

export const RecurrentTransactionFrequency = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export type RecurrentTransactionFrequencyKey =
  keyof typeof RecurrentTransactionFrequency;

export type RecurrentTransactionFrequencyValue =
  (typeof RecurrentTransactionFrequency)[RecurrentTransactionFrequencyKey];
