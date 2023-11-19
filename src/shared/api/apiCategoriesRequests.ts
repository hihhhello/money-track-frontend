import { QueryFunctionContext } from '@tanstack/react-query';
import { createUrlWithSearchParams } from '../utils/helpers';
import { axiosInstance } from './apiBase';

const getAll = (
  input: {
    searchParams: {
      type: 'deposit' | 'expense';
    };
  } & Partial<QueryFunctionContext>,
) =>
  axiosInstance
    .get<
      Array<{
        id: number;
        name: string;
        user_id: number;
        category_name: string;
      }>
    >(
      createUrlWithSearchParams({
        url: '/categories',
        searchParams: input?.searchParams,
      }),
    )
    .then(({ data }) => data);

const createOne = ({
  body,
}: {
  body: { name: string; type: 'deposit' | 'expense' };
}) =>
  axiosInstance
    .post<{
      id: number;
      name: string;
      user_id: number;
    }>('/categories', body)
    .then(({ data }) => data);

export const apiCategoriesRequests = {
  getAll,
  createOne,
};
