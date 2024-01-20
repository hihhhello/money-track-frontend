import { twMerge } from 'tailwind-merge';

import { PlusIcon } from '@/shared/icons/PlusIcon';
import { range } from 'lodash';

type CategoryListProps = {
  handleAddNewCategory?: () => void;
} & JSX.IntrinsicElements['div'];

export const CategoryListLoading = ({
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
      {range(9).map((index) => (
        <div key={index} className="group flex flex-col items-center gap-2">
          <div
            className={twMerge(
              'flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gray-300 transition-colors',
            )}
          ></div>

          <div
            className={twMerge(
              'h-4 w-20 animate-pulse overflow-hidden text-ellipsis whitespace-nowrap rounded-3xl bg-gray-300 text-sm',
            )}
          ></div>
        </div>
      ))}
    </div>

    <div>
      {handleAddNewCategory && (
        <button
          type="button"
          className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-main-blue text-main-white shadow-md hover:bg-main-blue/90"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  </div>
);
