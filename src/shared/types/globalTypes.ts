export type FinancialOperationTypeValue =
  (typeof FinancialOperationType)[keyof typeof FinancialOperationType];

export const FinancialOperationType = {
  EXPENSE: 'expense',
  DEPOSIT: 'deposit',
} as const;
