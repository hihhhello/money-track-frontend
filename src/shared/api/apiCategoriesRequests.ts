import { axiosInstance } from './apiBase';

const getAll = () =>
  axiosInstance
    .get<
      Array<{
        id: number;
        name: string;
        user_id: number;
      }>
    >('/categories')
    .then(({ data }) => data);

const createOne = ({ body }: { body: { name: string } }) =>
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
