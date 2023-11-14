import { axiosInstance } from './apiBase';

const createOne = ({
  body,
}: {
  body: {
    type: string;
    amount: string;
    category: number;
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
        user_id: number;
      }>
    >('/transactions')
    .then(({ data }) => data);

const deleteOne = ({ params }: { params: { transactionId: number } }) =>
  axiosInstance.delete(`/transactions/${params.transactionId}`);

export const apiTransactionsRequests = {
  createOne,
  getAll,
  deleteOne,
};
