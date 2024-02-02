import { QueryFunctionContext } from '@tanstack/react-query';
import { axiosInstance } from './apiBase';
import { Transaction } from '../types/transactionTypes';
import { FinancialOperationTypeValue } from '../types/globalTypes';
import {
  RecurrentTransaction,
  RecurrentTransactionFrequencyValue,
} from '../types/recurrentTransactionTypes';
import { createUrlWithSearchParams } from 'hihhhello-utils';

const createOne = ({
  body,
}: {
  body: {
    type: FinancialOperationTypeValue;
    amount: string;
    category_id: number;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
    frequency: RecurrentTransactionFrequencyValue;
  };
}) => {
  return axiosInstance.post('/recurrent_transactions', body);
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
    .get<RecurrentTransaction[]>(
      createUrlWithSearchParams({
        url: '/recurrent_transactions',
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
    description: string | null;
    frequency: RecurrentTransactionFrequencyValue;
    start_date: string | null;
    end_date: string | null;
    next_transaction: string | null;
  }>;
  params: {
    transactionId: number;
  };
}) =>
  axiosInstance.patch<Transaction[]>(
    `/recurrent_transactions/${params.transactionId}`,
    body,
  );

const deleteOne = ({ params }: { params: { transactionId: number } }) =>
  axiosInstance.delete(`/recurrent_transactions/${params.transactionId}`);

export const apiRecurrentTransactionsRequests = {
  createOne,
  getAll,
  deleteOne,
  editOne,
};
