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
  <div className="flex items-center gap-4">
    <div
      className={twMerge('flex items-center gap-4 overflow-x-auto', className)}
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
