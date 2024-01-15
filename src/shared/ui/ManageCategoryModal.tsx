'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/icons/XMarkIcon';
import { isEmpty } from 'lodash';
import { TrashIcon } from '../icons/TrashIcon';
import { classNames } from '../utils/helpers';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogContent } from './Dialog/DialogContent';

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
          <div className="z-10 border-b-2 p-4">
            <div
              className={classNames(
                'flex',
                handleDelete ? 'justify-between' : 'justify-end',
              )}
            >
              {handleDelete && (
                <button onClick={handleDeleteCategory}>
                  <TrashIcon className="text-red-600 hover:text-red-500" />
                </button>
              )}

              <button onClick={handleClose}>
                <XMarkIcon />
              </button>
            </div>

            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>
          </div>

          <div className="h-full overflow-y-auto p-4">
            <div>
              <div className="mb-4 flex flex-col">
                <label htmlFor="categoryName">Name</label>
                <input
                  className="focus:ring-primary-green block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-base"
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

          <div className="z-10 border-t-2 p-4">
            <button
              onClick={handleSubmit}
              className="block w-full rounded-md bg-main-blue px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};
