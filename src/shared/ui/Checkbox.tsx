import { Ref, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Checkbox = forwardRef(function Input(
  { className, ...props }: Omit<JSX.IntrinsicElements['input'], 'type'>,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={twMerge(
        'rounded-lg border-0 px-4 py-3 text-main-blue ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-main-blue',
        className,
      )}
      {...props}
    />
  );
});
