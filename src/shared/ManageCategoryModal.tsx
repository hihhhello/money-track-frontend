'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/ui/Icons/XMarkIcon';
import { isEmpty } from 'lodash';
import { TrashIcon } from './ui/Icons/TrashIcon';
import { classNames } from './utils/helpers';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName || isEmpty(categoryName.trim())) {
      return toast.warn(
        'The category name should contain at least 1 character.',
      );
    }

    propsHandleSubmit(categoryName)?.then(() => setCategoryName(''));
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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-black/30 sm:block" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative h-full w-full bg-white p-4 pb-20 sm:h-auto sm:max-w-sm sm:rounded">
              <div
                className={classNames(
                  'mb-8 flex',
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

              <form onSubmit={handleSubmit}>
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

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {submitButtonLabel ?? 'Submit'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
