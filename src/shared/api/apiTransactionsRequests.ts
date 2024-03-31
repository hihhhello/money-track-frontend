import { QueryFunctionContext } from '@tanstack/react-query';
import { createUrlWithSearchParams } from 'hihhhello-utils';
import { omit } from 'lodash';

import { FinancialOperationTypeValue } from '../types/globalTypes';
import {
  Transaction,
  APITransactionPeriodFilter,
} from '../types/transactionTypes';
import { axiosInstance } from './apiBase';

const createOne = ({
  body,
}: {
  body: {
    type: FinancialOperationTypeValue;
    amount: string;
    category_id: number;
    date: string;
    description?: string | null;
    spending_group_ids?: number[];
  };
}) => {
  return axiosInstance.post('/transactions', body);
};

const getAll = (
  input?: {
    searchParams?: {
      startDate?: string;
      endDate?: string;
      period?: APITransactionPeriodFilter;
      spendingGroupIds?: number[];
      includePersonal?: boolean;
    };
  } & Partial<QueryFunctionContext>,
) =>
  axiosInstance
    .get<Transaction[]>(
      createUrlWithSearchParams({
        url: '/transactions',
        searchParams: {
          ...omit(input?.searchParams, 'spendingGroupIds'),
          sgid: input?.searchParams?.spendingGroupIds,
        },
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
    spending_group_ids?: number[];
  }>;
  params: {
    transactionId: number;
  };
}) =>
  axiosInstance.patch<Transaction>(
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
