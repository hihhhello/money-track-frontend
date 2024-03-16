export const ManageTransactionModalTab = {
  CATEGORIES: 'CATEGORIES',
  GROUPS: 'SELECT_GROUP',
} as const;

export type ManageTransactionModalTabType =
  (typeof ManageTransactionModalTab)[keyof typeof ManageTransactionModalTab];
