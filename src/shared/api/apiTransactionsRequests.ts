import { axiosInstance } from './apiBase';

const createOne = ({
  body,
}: {
  body: {
    type: string;
    amount: string;
    category: string;
    date: string;
  };
}) => {
  return axiosInstance.post('/transactions', body);
};

export const apiTransactionsRequests = {
  createOne,
};
