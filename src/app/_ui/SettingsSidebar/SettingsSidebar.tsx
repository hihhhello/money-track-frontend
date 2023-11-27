'use client';

import { useEnvironment } from '@/providers/EnvironmentProvider';
import { SquaresPlusIcon } from '@/shared/ui/Icons/SquaresPlusIcon';
import { XMarkIcon } from '@/shared/ui/Icons/XMarkIcon';
import { Dialog, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import { CategoriesDisclosure } from './ui/CategoriesDisclosure';
import Link from 'next/link';
import { RecurrentTransactionIcon } from '@/shared/ui/Icons/RecurrentTransactionIcon';
import { PieChartIcon } from '@/shared/ui/Icons/PieChartIcon';

export const SettingsSidebar = () => {
  const { settingsSidebar } = useEnvironment();

  return (
    <Transition.Root show={settingsSidebar.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={settingsSidebar.handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[250px]">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={settingsSidebar.handleClose}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex h-full flex-col justify-end overflow-y-auto bg-white pb-6 shadow-xl">
                    <div className="relative flex-1">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex flex-col items-center">
                          <Link
                            onClick={settingsSidebar.handleClose}
                            href="/"
                            className="flex w-full flex-col items-center py-4 hover:bg-gray-200"
                          >
                            <PieChartIcon className="h-12 w-12 text-indigo-600" />

                            <span>Dashboard</span>
                          </Link>

                          <Link
                            onClick={settingsSidebar.handleClose}
                            href="/categories"
                            className="flex w-full flex-col items-center py-4 hover:bg-gray-200"
                          >
                            <SquaresPlusIcon className="h-12 w-12 text-indigo-600" />

                            <span>Categories</span>
                          </Link>

                          <Link
                            onClick={settingsSidebar.handleClose}
                            href="/recurrent-transactions"
                            className="flex w-full flex-col items-center py-4 hover:bg-gray-200"
                          >
                            <RecurrentTransactionIcon className="h-12 w-12 text-indigo-600" />

                            <span>Recurrent Transactions</span>
                          </Link>
                        </div>

                        <div className="px-4 sm:px-6">
                          <button
                            onClick={() => signOut()}
                            className="w-full rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
