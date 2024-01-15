import { twMerge } from 'tailwind-merge';

export const TextArea = ({
  className,
  ...props
}: JSX.IntrinsicElements['textarea']) => (
  <textarea
    className={twMerge(
      'block w-full rounded-2xl border-0 px-4 py-3 text-main-dark ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-main-blue',
      className,
    )}
    {...props}
  />
);
