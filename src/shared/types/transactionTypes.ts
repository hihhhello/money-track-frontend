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
