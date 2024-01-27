'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/api';
import {
  ManageSpendingGroupModal,
  ManageSpendingGroupModalProps,
} from '@/shared/ui/ManageSpendingGroupModal';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { SpendingGroup } from '@/shared/types/spendingGroupTypes';

type SpendingGroupsPageContentProps = {
  spendingGroups: SpendingGroup[];
};

export const SpendingGroupsPageContent = ({
  spendingGroups: initialSpendingGroups,
}: SpendingGroupsPageContentProps) => {
  const loadingToast = useLoadingToast();

  const { data: spendingGroups, refetch: refetchSpendingGroups } = useQuery({
    queryFn: api.spendingGroups.getAll,
    initialData: initialSpendingGroups,
    queryKey: ['api.spendingGroups.getAll'],
  });

  const {
    value: isAddNewSpendingGroupModalOpen,
    setTrue: handleOpenNewSpendingGroupModal,
    setFalse: handleCloseNewSpendingGroupModal,
  } = useBoolean(false);

  const handleAddNewSpendingGroup: ManageSpendingGroupModalProps['handleSubmit'] =
    (newSpendingGroupValues) => {
      const toastId = loadingToast.showLoading(
        'Creating new spending group...',
      );

      return api.spendingGroups
        .createOne({
          body: {
            name: newSpendingGroupValues.name,
            description: newSpendingGroupValues.description,
          },
        })
        .then(() => {
          refetchSpendingGroups();

          loadingToast.handleSuccess({
            message: 'You successfully created new spending group.',
            toastId,
          });
        })
        .catch(() => {
          loadingToast.handleError({ toastId, message: 'Error' });
        });
    };

  return (
    <div className="flex-grow overflow-y-hidden">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex gap-4">
          <button
            onClick={handleOpenNewSpendingGroupModal}
            className="rounded bg-main-blue px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-main-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
          >
            Add new group
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {spendingGroups?.map((spendingGroup) => (
            <div
              key={spendingGroup.id}
              className="flex flex-col rounded-lg bg-main-paper px-4 py-1 pr-2 sm:flex-row sm:items-center sm:justify-between"
            >
              {spendingGroup.name} - {spendingGroup.description}
            </div>
          ))}
        </div>
      </div>

      <ManageSpendingGroupModal
        isModalOpen={isAddNewSpendingGroupModalOpen}
        handleClose={handleCloseNewSpendingGroupModal}
        handleSubmit={handleAddNewSpendingGroup}
        title="Add new spending group"
        submitButtonLabel="Add"
      />
    </div>
  );
};
