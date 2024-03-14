import { Dialog } from '@headlessui/react';

import { XMarkIcon } from '@/shared/icons/XMarkIcon';

type DialogHeaderProps = {
  title: string;
  handleClose: () => void;
};

export const DialogHeader = ({ handleClose, title }: DialogHeaderProps) => (
  <div className="z-10 flex items-center justify-between p-4">
    <Dialog.Title as="h3" className="text-xl text-main-dark">
      {title}
    </Dialog.Title>

    <button onClick={handleClose}>
      <XMarkIcon />
    </button>
  </div>
);
