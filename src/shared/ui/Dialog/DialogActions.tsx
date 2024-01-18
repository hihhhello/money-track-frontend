import { twMerge } from 'tailwind-merge';

type DialogActionsProps = JSX.IntrinsicElements['div'];

export const DialogActions = ({
  children,
  className,
  ...divProps
}: DialogActionsProps) => (
  <div
    className={twMerge('z-10 flex gap-4 p-4 pb-8 sm:pb-4', className)}
    {...divProps}
  >
    {children}
  </div>
);
