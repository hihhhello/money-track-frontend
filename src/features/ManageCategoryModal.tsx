'use client';

import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { DialogOverlay } from '../shared/ui/Dialog/DialogOverlay';
import { DialogContent } from '../shared/ui/Dialog/DialogContent';
import { DialogHeader } from '../shared/ui/Dialog/DialogHeader';
import { Input } from '../shared/ui/Input';
import { DialogActions } from '../shared/ui/Dialog/DialogActions';

type ManageCategoryModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (categoryName: string) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultCategoryName?: string;
  handleDelete?: () => Promise<void> | undefined | void;
};

export const ManageCategoryModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  title,
  submitButtonLabel,
  defaultCategoryName,
  handleDelete,
}: ManageCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(defaultCategoryName ?? '');

  useEffect(() => {
    setCategoryName(defaultCategoryName ?? '');
  }, [defaultCategoryName]);

  const handleSubmit = () => {
    if (!categoryName || isEmpty(categoryName.trim())) {
      return toast.warn(
        'The category name should contain at least 1 character.',
      );
    }

    propsHandleSubmit(categoryName)?.then(() => {
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
                <label htmlFor="categoryName">Name</label>
                <Input
                  name="categoryName"
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
