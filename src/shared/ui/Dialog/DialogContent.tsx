import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

export const DialogContent = ({ children }: { children: ReactNode }) => (
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
      <Dialog.Panel className="relative flex h-full w-full flex-col bg-main-paper sm:max-h-[550px] sm:max-w-5xl sm:rounded-3xl">
        {children}
      </Dialog.Panel>
    </Transition.Child>
  </div>
);