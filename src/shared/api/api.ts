import { apiAuthRequests } from './apiAuthRequests';
import { apiCategoriesRequests } from './apiCategoriesRequests';
import { apiTransactionsRequests } from './apiTransactionsRequests';

export const api = {
  auth: apiAuthRequests,
  transactions: apiTransactionsRequests,
  categories: apiCategoriesRequests,
};
