'use client';

import { Dialog, Transition } from '@headlessui/react';
import { formatISO } from 'date-fns';
import { isNil } from 'lodash';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { DialogActions } from '../../shared/ui/Dialog/DialogActions';
import { DialogContent } from '../../shared/ui/Dialog/DialogContent';
import { DialogHeader } from '../../shared/ui/Dialog/DialogHeader';
import { DialogOverlay } from '../../shared/ui/Dialog/DialogOverlay';
import { DialogScrollableContent } from '../../shared/ui/Dialog/DialogScrollableContent';
import { DollarInput } from '../../shared/ui/DollarInput';
import { Input } from '../../shared/ui/Input';
import { ManageTransactionModalCategories } from './components/ManageTransactionModalCategories';
import { ManageTransactionModalSpendingGroups } from './components/ManageTransactionModalSpendingGroups';

type TransactionValues = {
  amount: number | null;
  date: string;
  description: string | null;
};

type ManageTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (transactionValues: {
    amount: string;
    date: string;
    description: string | null;
    categoryId: number;
  }) => Promise<void> | undefined | void;
  submitButtonLabel?: string;
  title: string;
  defaultValues?: {
    amount: string;
    date: string;
    description: string | null;
  };
  selectedCategoryId: number | null;
  children?: ReactNode;
};

export const ManageTransactionModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  submitButtonLabel,
  title,
  defaultValues: defaultValues,
  selectedCategoryId,
  children,
}: ManageTransactionModalProps) => {
  const today = formatISO(new Date(), { representation: 'date' });

  const [transactionFormValues, setTransactionFormValues] =
    useState<TransactionValues>({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ? parseFloat(defaultValues?.amount) : null,
      description: defaultValues?.description ?? null,
    });

  useEffect(() => {
    setTransactionFormValues({
      date: defaultValues?.date ?? today,
      amount: defaultValues?.amount ? parseFloat(defaultValues?.amount) : null,
      description: defaultValues?.description ?? null,
    });
  }, [defaultValues, today]);

  const handleSubmit = () => {
    if (isNil(transactionFormValues.amount)) {
      return toast.warn('Type an amount.');
    }

    if (transactionFormValues.amount === 0) {
      return toast.warn('Type an amount greater than $0.');
    }

    if (!selectedCategoryId) {
      return toast.warn('Select a category.');
    }

    propsHandleSubmit({
      ...transactionFormValues,
      amount: String(transactionFormValues.amount),
      categoryId: selectedCategoryId,
    })?.then(() => {
      setTransactionFormValues({
        amount: null,
        date: today,
        description: null,
      });
      handleClose();
    });
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <DialogOverlay />

        <DialogContent panelClassName="sm:h-full">
          <DialogHeader handleClose={handleClose} title={title} />

          <DialogScrollableContent>
            <div className="flex justify-center items-center">
              <Input
                name="date"
                type="date"
                value={transactionFormValues.date}
                onChange={(e) => {
                  setTransactionFormValues((prevValues) => ({
                    ...prevValues,
                    date: e.target.value,
                  }));
                }}
                className="w-auto"
              />
            </div>

            <div className="mb-4 flex flex-col">
              <label htmlFor="amount">Amount</label>

              <DollarInput
                initialFocus
                name="amount"
                value={transactionFormValues.amount}
                handleValueChange={(value) =>
                  setTransactionFormValues((prevValues) => ({
                    ...prevValues,
                    amount: value,
                  }))
                }
              />
            </div>

            <div className="flex mb-4 flex-col">
              <label htmlFor="description">Description</label>
              <Input
                onChange={(e) => {
                  setTransactionFormValues((prevValues) => ({
                    ...prevValues,
                    description: e.target.value,
                  }));
                }}
                value={transactionFormValues.description ?? ''}
                name="description"
              />
            </div>

            <hr className="mb-4" />

            {children}
          </DialogScrollableContent>

          <DialogActions>
            <button
              onClick={handleSubmit}
              className="block w-full rounded-full bg-main-blue px-3.5 py-2.5 text-lg text-white shadow-sm hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue sm:text-sm"
            >
              {submitButtonLabel ?? 'Submit'}
            </button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Transition>
  );
};

ManageTransactionModal.Categories = ManageTransactionModalCategories;
ManageTransactionModal.SpendingGroups = ManageTransactionModalSpendingGroups;
