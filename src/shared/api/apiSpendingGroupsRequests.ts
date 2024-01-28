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
  return axiosInstance.post('/spending_groups', body);
};

const getAll = () =>
  axiosInstance
    .get<SpendingGroup[]>('/spending_groups')
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
    `/spending_groups/${params.spendingGroupId}`,
    body,
  );

const deleteOne = ({ params }: { params: { spendingGroupId: number } }) =>
  axiosInstance.delete(`/spending_groups/${params.spendingGroupId}`);

const inviteUser = ({
  body,
  params,
}: {
  body: {
    email: string;
  };
  params: {
    spendingGroupId: number;
  };
}) =>
  axiosInstance.post<SpendingGroup>(
    `/spending_groups/${params.spendingGroupId}/add_user`,
    body,
  );

export const apiSpendingGroupsRequests = {
  createOne,
  getAll,
  deleteOne,
  editOne,
  inviteUser,
};
