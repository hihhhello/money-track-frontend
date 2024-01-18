import { twMerge } from 'tailwind-merge';

import { PlusIcon } from '@/shared/icons/PlusIcon';

type CategoryListProps = {
  handleAddNewCategory?: () => void;
} & JSX.IntrinsicElements['div'];

export const CategoryList = ({
  children,
  className,
  handleAddNewCategory,
  ...props
}: CategoryListProps) => (
  <div className="flex flex-col items-start gap-4">
    <div
      className={twMerge(
        'grid max-h-60 w-full grid-cols-3 gap-4 overflow-y-auto sm:max-h-24 sm:grid-cols-9',
        className,
      )}
      {...props}
    >
      {children}
    </div>

    <div>
      {handleAddNewCategory && (
        <button
          type="button"
          onClick={handleAddNewCategory}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-main-blue text-main-white shadow-md hover:bg-main-blue/90"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  </div>
);
