import { Ref, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(function Input(
  { className, ...props }: JSX.IntrinsicElements['input'],
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      placeholder="Enter here"
      className={twMerge(
        'block w-full rounded-2xl border-0 px-4 py-3 text-main-dark ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-main-blue',
        className,
      )}
      {...props}
    />
  );
});
