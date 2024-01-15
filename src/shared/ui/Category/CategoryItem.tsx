import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CategoryItemProps = {
  children: ReactNode;
  isSelected?: boolean;
} & JSX.IntrinsicElements['button'];

export const CategoryItem = ({ children, isSelected }: CategoryItemProps) => (
  <button
    type="button"
    className={twMerge(
      'h-full rounded-3xl bg-white px-4 py-2 shadow-md transition-colors hover:bg-main-dark hover:text-white',
      isSelected && 'bg-main-blue text-main-white',
    )}
  >
    {children}
  </button>
);
