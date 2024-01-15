import { twMerge } from 'tailwind-merge';

export const Input = ({
  className,
  ...props
}: JSX.IntrinsicElements['input']) => (
  <input
    placeholder="Enter here"
    className={twMerge(
      'block w-full rounded-2xl border-0 px-4 py-3 text-main-dark ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-main-blue',
      className,
    )}
    {...props}
  />
);
