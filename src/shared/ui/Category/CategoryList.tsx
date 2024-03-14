import { PlusIcon } from '@/shared/icons/PlusIcon';
import { twMerge } from 'tailwind-merge';

type CategoryListProps = {
  handleAddNewCategory?: () => void;
  wrapperClassName?: string;
} & JSX.IntrinsicElements['div'];

export const CategoryList = ({
  children,
  className,
  handleAddNewCategory,
  wrapperClassName,
  ...props
}: CategoryListProps) => (
  <div className={twMerge('flex flex-col items-start gap-4', wrapperClassName)}>
    <div
      className={twMerge(
        'grid h-full w-full grid-cols-3 gap-4 overflow-y-auto sm:grid-cols-9',
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
