import { twMerge } from 'tailwind-merge';

export const CategoryList = ({
  children,
  className,
  ...props
}: JSX.IntrinsicElements['div']) => (
  <div
    className={twMerge('mb-2 flex gap-4 overflow-x-auto p-2', className)}
    {...props}
  >
    {children}
  </div>
);
