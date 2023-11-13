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

const getAll = () =>
  axiosInstance
    .get<
      Array<{
        amount: string;
        category: string;
        date: string;
        id: number;
        timestamp: string;
        type: 'expense' | 'deposit';
        user_id: 1;
      }>
    >('/transactions')
    .then(({ data }) => data);

const deleteOne = (params: { transactionId: number }) =>
  axiosInstance.delete(`/transactions/${params.transactionId}`);

export const apiTransactionsRequests = {
  createOne,
  getAll,
  deleteOne,
};
