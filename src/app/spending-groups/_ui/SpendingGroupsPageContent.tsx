'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/api';
import {
  ManageSpendingGroupModal,
  ManageSpendingGroupModalProps,
} from '@/features/ManageSpendingGroupModal';
import { useBoolean } from 'hihhhello-utils';
import { SpendingGroup } from '@/shared/types/spendingGroupTypes';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { DeleteConfirmationModal } from '@/shared/ui/DeleteConfirmationModal';
import { useState } from 'react';
import { InviteSpendingGroupUserModal } from '@/features/InviteSpendingGroupUserModal';
import { useLoadingToast } from '@/shared/utils/hooks';

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

  const [selectedTransaction, setSelectedTransaction] =
    useState<SpendingGroup | null>(null);

  const {
    value: isAddNewSpendingGroupModalOpen,
    setTrue: handleOpenNewSpendingGroupModal,
    setFalse: handleCloseNewSpendingGroupModal,
  } = useBoolean(false);

  const {
    value: isDeleteSpendingGroupModalOpen,
    setTrue: handleOpenDeleteSpendingGroupModal,
    setFalse: handleCloseDeleteSpendingGroupModal,
  } = useBoolean(false);

  const {
    value: isEditTransactionModalOpen,
    setTrue: handleOpenEditTransactionModal,
    setFalse: handleCloseEditTransactionModal,
  } = useBoolean(false);

  const {
    value: isInviteUserModalModalOpen,
    setTrue: handleOpenInviteUserModalModal,
    setFalse: handleCloseInviteUserModalModal,
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

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading('Deleting your spending group...');

    return api.spendingGroups
      .deleteOne({
        params: {
          spendingGroupId: selectedTransaction.id,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully deleted spending group.',
        });
        refetchSpendingGroups();
        handleCloseDeleteSpendingGroupModal();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleEditTransaction = (transactionValues: {
    name: string;
    description?: string | null;
  }) => {
    if (!selectedTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading('Editing your spending group...');

    return api.spendingGroups
      .editOne({
        body: {
          name: transactionValues.name,
          description: transactionValues.description,
        },
        params: {
          spendingGroupId: selectedTransaction.id,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully edited spending group.',
        });
        refetchSpendingGroups();
      })
      .catch(() => {
        loadingToast.handleError({ toastId, message: 'Error' });
      });
  };

  const handleInviteUser = (transactionValues: { email: string }) => {
    if (!selectedTransaction) {
      return;
    }

    const toastId = loadingToast.showLoading(
      'Inviting user to your spending group...',
    );

    return api.spendingGroups
      .inviteUser({
        body: {
          email: transactionValues.email,
        },
        params: {
          spendingGroupId: selectedTransaction.id,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully invite a user to spending group.',
        });
        refetchSpendingGroups();
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
              <p>
                {spendingGroup.name} - {spendingGroup.description}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTransaction(spendingGroup);
                    handleOpenInviteUserModalModal();
                  }}
                >
                  <UserPlusIcon className="h-6 w-6 text-main-green" />
                </button>

                <button
                  onClick={() => {
                    setSelectedTransaction(spendingGroup);
                    handleOpenDeleteSpendingGroupModal();
                  }}
                >
                  <TrashIcon className="h-6 w-6 text-main-orange" />
                </button>

                <button
                  onClick={() => {
                    setSelectedTransaction(spendingGroup);
                    handleOpenEditTransactionModal();
                  }}
                >
                  <PencilIcon className="h-6 w-6 text-main-blue" />
                </button>
              </div>
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
        handleDelete={handleDeleteTransaction}
      />

      <ManageSpendingGroupModal
        isModalOpen={isEditTransactionModalOpen}
        handleClose={handleCloseEditTransactionModal}
        handleSubmit={handleEditTransaction}
        title={`Edit ${selectedTransaction?.name}`}
        submitButtonLabel="Edit"
        defaultValues={
          selectedTransaction
            ? {
                name: selectedTransaction.name,
                description: selectedTransaction.description,
              }
            : undefined
        }
        handleDelete={handleDeleteTransaction}
      />

      <DeleteConfirmationModal
        isModalOpen={isDeleteSpendingGroupModalOpen}
        handleClose={handleCloseDeleteSpendingGroupModal}
        handleSubmit={handleDeleteTransaction}
      />

      <InviteSpendingGroupUserModal
        isModalOpen={isInviteUserModalModalOpen}
        handleClose={handleCloseInviteUserModalModal}
        handleSubmit={handleInviteUser}
        title={`Invite user to ${selectedTransaction?.name}  group`}
      />
    </div>
  );
};
