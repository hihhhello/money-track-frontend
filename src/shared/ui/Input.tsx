import { Ref, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const InputSize = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
} as const;

type InputSizeType = (typeof InputSize)[keyof typeof InputSize];

export type InputProps = {
  size?: InputSizeType;
  handleValueChange?: (value: string) => void;
} & Omit<JSX.IntrinsicElements['input'], 'size'>;

const inputSizeClasses: Record<InputSizeType, string> = {
  [InputSize.Small]: 'text-sm px-2 py-1.5',
  [InputSize.Medium]: 'text-base px-4 py-3',
  [InputSize.Large]: 'text-lg px-5 py-4',
};

export const Input = forwardRef(function Input(
  {
    className,
    size = InputSize.Medium,
    onChange,
    handleValueChange,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      onChange={(e) => {
        handleValueChange?.(e.target.value);
        onChange?.(e);
      }}
      placeholder="Enter here"
      className={twMerge(
        'block w-full rounded-2xl border-0 text-main-dark ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-main-blue',
        inputSizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
