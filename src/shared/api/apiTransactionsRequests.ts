import { QueryFunctionContext } from '@tanstack/react-query';
import { axiosInstance } from './apiBase';
import { createUrlWithSearchParams } from '../utils/helpers';
import { Transaction } from '../types/transactionTypes';

const createOne = ({
  body,
}: {
  body: {
    type: 'expense' | 'deposit';
    amount: string;
    category_id: number;
    date: string;
    description?: string | null;
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
    .get<Transaction[]>(
      createUrlWithSearchParams({
        url: '/transactions',
        searchParams: input?.searchParams,
      }),
    )
    .then(({ data }) => data);

const editOne = ({
  body,
  params,
}: {
  body: Partial<{
    amount: string;
    category_id: number;
    date: string;
    description: string | null;
  }>;
  params: {
    transactionId: number;
  };
}) =>
  axiosInstance.patch<Transaction[]>(
    `/transactions/${params.transactionId}`,
    body,
  );

const deleteOne = ({ params }: { params: { transactionId: number } }) =>
  axiosInstance.delete(`/transactions/${params.transactionId}`);

export const apiTransactionsRequests = {
  createOne,
  getAll,
  deleteOne,
  editOne,
};
