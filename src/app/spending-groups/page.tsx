import { api } from '@/shared/api/api';

import { SpendingGroupsPageContent } from './_ui/SpendingGroupsPageContent';

const SpendingGroupsPage = async () => {
  const spendingGroups = await api.spendingGroups.getAll();

  return <SpendingGroupsPageContent spendingGroups={spendingGroups} />;
};

export default SpendingGroupsPage;
