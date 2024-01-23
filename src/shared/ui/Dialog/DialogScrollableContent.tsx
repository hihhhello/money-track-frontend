import { twMerge } from 'tailwind-merge';

type DialogScrollableContentProps = JSX.IntrinsicElements['div'];

export const DialogScrollableContent = ({
  className,
  children,
  ...divProps
}: DialogScrollableContentProps) => (
  <div
    className={twMerge('flex h-full flex-col overflow-y-auto p-4', className)}
    {...divProps}
  >
    {children}
  </div>
);
