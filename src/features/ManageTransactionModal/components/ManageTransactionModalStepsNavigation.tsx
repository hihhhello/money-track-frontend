import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { classNames } from 'hihhhello-utils';

import {
  TransactionCreationStep,
  TransactionCreationStepType,
} from '@/shared/types/transactionTypes';

type ManageTransactionModalStepsNavigationProps = {
  currentStep: TransactionCreationStepType;
  setCurrentStep: (step: TransactionCreationStepType) => void;
};

export const ManageTransactionModalStepsNavigation = ({
  currentStep,
  setCurrentStep,
}: ManageTransactionModalStepsNavigationProps) => (
  <div
    className={classNames(
      'flex mb-2',
      currentStep === TransactionCreationStep.SELECT_CATEGORY
        ? 'justify-end'
        : 'justify-start',
    )}
  >
    {currentStep === TransactionCreationStep.SELECT_GROUP && (
      <button
        className="flex items-center gap-1 text-main-blue"
        onClick={() => setCurrentStep(TransactionCreationStep.SELECT_CATEGORY)}
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to categories
      </button>
    )}

    {currentStep === TransactionCreationStep.SELECT_CATEGORY && (
      <button
        className="flex items-center gap-1 text-main-blue"
        onClick={() => setCurrentStep(TransactionCreationStep.SELECT_GROUP)}
      >
        Select group
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);
