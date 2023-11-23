import { FinancialOperationTypeValue } from './globalTypes';

export type Category = {
  id: number;
  name: string;
  user_id: number;
  type: FinancialOperationTypeValue;
};
