import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '../types/globalTypes';

export const getNetAmount = (transaction: {
  amount: string;
  type: FinancialOperationTypeValue;
}) => {
  if (transaction.type === FinancialOperationType.DEPOSIT) {
    return parseFloat(transaction.amount);
  }

  return -parseFloat(transaction.amount);
};
