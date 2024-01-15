import { twMerge } from 'tailwind-merge';

export const CategoryList = ({
  children,
  className,
  ...props
}: JSX.IntrinsicElements['div']) => (
  <div
    className={twMerge(
      'mb-2 flex max-h-40 flex-wrap gap-4 overflow-y-auto p-2 sm:max-h-24',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
