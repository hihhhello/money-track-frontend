import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type CategoryItemProps = {
  children: ReactNode;
  isSelected?: boolean;
} & JSX.IntrinsicElements['button'];

export const CategoryItem = forwardRef<HTMLButtonElement, CategoryItemProps>(
  ({ children, isSelected, ...props }: CategoryItemProps, ref) => (
    <button
      type="button"
      className="group flex flex-col items-center gap-2"
      ref={ref}
      {...props}
    >
      <div
        className={twMerge(
          'flex h-16 w-16 items-center justify-center rounded-full bg-white transition-colors',
          !isSelected && 'group-hover:bg-main-blue group-hover:text-white',
          isSelected && 'bg-main-dark text-white',
        )}
      >
        {/* TODO: replace with Icon from props */}
        <SquaresPlusIcon height={32} width={32} />
      </div>

      <span
        className={twMerge(
          'w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm',
          isSelected && 'font-medium',
        )}
      >
        {children}
      </span>
    </button>
  ),
);

CategoryItem.displayName = 'CategoryItem';
