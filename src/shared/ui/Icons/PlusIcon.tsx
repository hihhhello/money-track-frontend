import { twMerge } from 'tailwind-merge';

type PlusIconProps = JSX.IntrinsicElements['svg'];

export const PlusIcon = ({ className, ...iconProps }: PlusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={twMerge('fill-none stroke-white', className)}
      {...iconProps}
    >
      <path
        d="M12 5V19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
