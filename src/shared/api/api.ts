import { apiAuthRequests } from './apiAuthRequests';
import { apiCategoriesRequests } from './apiCategoriesRequests';
import { apiRecurrentTransactionsRequests } from './apiRecurrentTransactionsRequests';
import { apiSpendingGroupsRequests } from './apiSpendingGroupsRequests';
import { apiTransactionsRequests } from './apiTransactionsRequests';

export const api = {
  auth: apiAuthRequests,
  transactions: apiTransactionsRequests,
  categories: apiCategoriesRequests,
  recurrentTransactions: apiRecurrentTransactionsRequests,
  spendingGroups: apiSpendingGroupsRequests,
};
