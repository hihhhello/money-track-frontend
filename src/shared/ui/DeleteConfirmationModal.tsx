import { Dialog, Transition } from '@headlessui/react';
import { DialogContent } from './Dialog/DialogContent';
import { DialogActions } from './Dialog/DialogActions';
import { Fragment } from 'react';
import { DialogHeader } from './Dialog/DialogHeader';
import { DialogOverlay } from './Dialog/DialogOverlay';
import { DialogScrollableContent } from './Dialog/DialogScrollableContent';

type DeleteConfirmationModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

export const DeleteConfirmationModal = ({
  handleClose,
  handleSubmit,
  isModalOpen,
}: DeleteConfirmationModalProps) => {
  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <DialogOverlay />

        <DialogContent>
          <DialogHeader handleClose={handleClose} title="Confirm" />

          <DialogScrollableContent>
            <p>Are you sure you want to proceed with deletion?</p>
          </DialogScrollableContent>

          <DialogActions>
            <button
              onClick={handleClose}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-lg text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue sm:text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-white px-3.5 py-2.5 text-lg text-main-orange shadow-sm hover:bg-main-dark/10 sm:text-sm"
            >
              Delete
            </button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};
