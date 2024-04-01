import { QueryFunctionContext } from '@tanstack/react-query';
import { createUrlWithSearchParams } from 'hihhhello-utils';

import { Category } from '../types/categoryTypes';
import { FinancialOperationTypeValue } from '../types/globalTypes';
import { axiosInstance } from './apiBase';

const getAll = (
  input?: {
    searchParams?: {
      type: FinancialOperationTypeValue;
      rankByUsage?: boolean;
    };
  } & Partial<QueryFunctionContext>,
) =>
  axiosInstance
    .get<Category[]>(
      createUrlWithSearchParams({
        url: '/categories',
        searchParams: {
          type: input?.searchParams?.type,
          do_rank: input?.searchParams?.rankByUsage,
        },
      }),
    )
    .then(({ data }) => data);

const createOne = ({
  body,
}: {
  body: { name: string; type: FinancialOperationTypeValue };
}) =>
  axiosInstance.post<Category>('/categories', body).then(({ data }) => data);

const deleteOne = ({ params }: { params: { categoryId: number } }) =>
  axiosInstance
    .delete(`/categories/${params.categoryId}`)
    .then(({ data }) => data);

export const apiCategoriesRequests = {
  getAll,
  createOne,
  deleteOne,
};
