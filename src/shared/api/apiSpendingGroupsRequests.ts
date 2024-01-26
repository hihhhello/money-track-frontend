import { axiosInstance } from './apiBase';
import { SpendingGroup } from '../types/spendingGroupTypes';

const createOne = ({
  body,
}: {
  body: {
    name: string;
    description?: string | null;
  };
}) => {
  return axiosInstance.post('/spending-groups', body);
};

const getAll = () =>
  axiosInstance
    .get<SpendingGroup[]>('/spending-groups')
    .then(({ data }) => data);

const editOne = ({
  body,
  params,
}: {
  body: Partial<{
    name: string;
    description: string | null;
  }>;
  params: {
    spendingGroupId: number;
  };
}) =>
  axiosInstance.patch<SpendingGroup>(
    `/spending-groups/${params.spendingGroupId}`,
    body,
  );

const deleteOne = ({ params }: { params: { spendingGroupId: number } }) =>
  axiosInstance.delete(`/spending-groups/${params.spendingGroupId}`);

export const apiSpendingGroupsRequests = {
  createOne,
  getAll,
  deleteOne,
  editOne,
};
