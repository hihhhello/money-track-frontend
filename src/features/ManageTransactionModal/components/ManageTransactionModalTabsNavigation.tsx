import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { classNames } from 'hihhhello-utils';

import {
  ManageTransactionModalTab,
  ManageTransactionModalTabType,
} from '../utils/manageTransactionModalTypes';

type ManageTransactionModalStepsNavigationProps = {
  currentTab: ManageTransactionModalTabType;
  setCurrentTab: (step: ManageTransactionModalTabType) => void;
};

export const ManageTransactionModalStepsNavigation = ({
  currentTab: currentStep,
  setCurrentTab: setCurrentStep,
}: ManageTransactionModalStepsNavigationProps) => (
  <div
    className={classNames(
      'flex mb-2',
      currentStep === ManageTransactionModalTab.CATEGORIES
        ? 'justify-end'
        : 'justify-start',
    )}
  >
    {currentStep === ManageTransactionModalTab.GROUPS && (
      <button
        className="flex items-center gap-1 text-main-blue"
        onClick={() => setCurrentStep(ManageTransactionModalTab.CATEGORIES)}
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to categories
      </button>
    )}

    {currentStep === ManageTransactionModalTab.CATEGORIES && (
      <button
        className="flex items-center gap-1 text-main-blue"
        onClick={() => setCurrentStep(ManageTransactionModalTab.GROUPS)}
      >
        Select group
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);
