import { twMerge } from 'tailwind-merge';

type TargetIconProps = JSX.IntrinsicElements['svg'];

export const TargetIcon = ({ className, ...iconProps }: TargetIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className={twMerge('fill-none stroke-main-dark', className)}
      {...iconProps}
    >
      <path
        d="M19.9999 36.6663C29.2047 36.6663 36.6666 29.2044 36.6666 19.9997C36.6666 10.7949 29.2047 3.33301 19.9999 3.33301C10.7952 3.33301 3.33325 10.7949 3.33325 19.9997C3.33325 29.2044 10.7952 36.6663 19.9999 36.6663Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.0001 23.3337C21.841 23.3337 23.3334 21.8413 23.3334 20.0003C23.3334 18.1594 21.841 16.667 20.0001 16.667C18.1591 16.667 16.6667 18.1594 16.6667 20.0003C16.6667 21.8413 18.1591 23.3337 20.0001 23.3337Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
