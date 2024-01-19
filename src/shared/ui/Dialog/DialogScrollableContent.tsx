import { twMerge } from 'tailwind-merge';

type DialogScrollableContentProps = JSX.IntrinsicElements['div'];

export const DialogScrollableContent = ({
  className,
  children,
  ...divProps
}: DialogScrollableContentProps) => (
  <div
    className={twMerge('h-full overflow-y-auto p-4', className)}
    {...divProps}
  >
    {children}
  </div>
);
