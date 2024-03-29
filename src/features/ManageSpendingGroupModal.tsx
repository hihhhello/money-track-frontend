'use client';

import { Dialog, Transition } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { DialogActions } from '../shared/ui/Dialog/DialogActions';
import { DialogContent } from '../shared/ui/Dialog/DialogContent';
import { DialogHeader } from '../shared/ui/Dialog/DialogHeader';
import { DialogOverlay } from '../shared/ui/Dialog/DialogOverlay';
import { Input } from '../shared/ui/Input';

export type ManageSpendingGroupModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (params: {
    name: string;
    description?: string | null;
  }) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  handleDelete?: () => Promise<void> | undefined | void;
  defaultValues?: {
    name: string;
    description?: string | null;
  };
};

export const ManageSpendingGroupModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  title,
  submitButtonLabel,
  handleDelete,
  defaultValues,
}: ManageSpendingGroupModalProps) => {
  const [categoryName, setCategoryName] = useState(defaultValues?.name ?? '');
  const [description, setDescription] = useState(
    defaultValues?.description ?? null,
  );

  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    setCategoryName(defaultValues.name ?? '');
    setDescription(defaultValues.description ?? null);
  }, [defaultValues]);

  const handleSubmit = () => {
    if (!categoryName || isEmpty(categoryName.trim())) {
      return toast.warn(
        'The category name should contain at least 1 character.',
      );
    }

    propsHandleSubmit({ name: categoryName, description })?.then(() => {
      setCategoryName('');
      handleClose();
    });
  };

  const handleDeleteCategory = () => {
    handleDelete?.()?.then(() => {
      setCategoryName('');
      handleClose();
    });
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <DialogOverlay />

        <DialogContent>
          <DialogHeader handleClose={handleClose} title={title} />

          <div className="h-full overflow-y-auto p-4">
            <div>
              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="name">Name</label>

                <Input
                  name="name"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="description">Description</label>

                <Input
                  name="description"
                  value={description ?? ''}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4"></div>
            </div>
          </div>

          <DialogActions>
            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-lg text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue sm:text-sm"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>

            {handleDelete && (
              <button
                onClick={handleDeleteCategory}
                className="block w-full rounded-full bg-white px-3.5 py-2.5 text-lg text-main-orange shadow-sm hover:bg-main-dark/10 sm:text-sm"
              >
                Delete
              </button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};
