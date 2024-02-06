'use client';

import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { DialogOverlay } from '../shared/ui/Dialog/DialogOverlay';
import { DialogContent } from '../shared/ui/Dialog/DialogContent';
import { DialogHeader } from '../shared/ui/Dialog/DialogHeader';
import { Input } from '../shared/ui/Input';
import { DialogActions } from '../shared/ui/Dialog/DialogActions';

export type InviteSpendingGroupUserModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (params: { email: string }) => Promise<void> | undefined | void;
  title: string;
};

export const InviteSpendingGroupUserModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  title,
}: InviteSpendingGroupUserModalProps) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = () => {
    if (!categoryName || isEmpty(categoryName.trim())) {
      return toast.warn(
        'The category name should contain at least 1 character.',
      );
    }

    propsHandleSubmit({ email: categoryName })?.then(() => {
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
                <label htmlFor="email">Email</label>

                <Input
                  name="email"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
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
              Invite
            </button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};
