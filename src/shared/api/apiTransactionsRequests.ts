import { QueryFunctionContext } from '@tanstack/react-query';
import { axiosInstance } from './apiBase';
import { createUrlWithSearchParams } from '../utils/helpers';

const createOne = ({
  body,
}: {
  body: {
    type: 'expense' | 'deposit';
    amount: string;
    category: number;
    date: string;
  };
}) => {
  return axiosInstance.post('/transactions', body);
};

const getAll = (
  input?: {
    searchParams?: {
      startDate: string;
      endDate: string;
    };
  } & Partial<QueryFunctionContext>,
) =>
  axiosInstance
    .get<
      Array<{
        amount: string;
        category: string;
        date: string | null;
        id: number;
        timestamp: string;
        type: 'expense' | 'deposit';
        user_id: number;
      }>
    >(
      createUrlWithSearchParams({
        url: '/transactions',
        searchParams: input?.searchParams,
      }),
    )
    .then(({ data }) => data);

const deleteOne = ({ params }: { params: { transactionId: number } }) =>
  axiosInstance.delete(`/transactions/${params.transactionId}`);

export const apiTransactionsRequests = {
  createOne,
  getAll,
  deleteOne,
};
