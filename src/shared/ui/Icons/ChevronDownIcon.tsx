import { twMerge } from 'tailwind-merge';

type ChevronDownIconProps = JSX.IntrinsicElements['svg'];

export const ChevronDownIcon = ({
  className,
  ...iconProps
}: ChevronDownIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={twMerge('fill-none stroke-main-dark', className)}
      {...iconProps}
    >
      <path
        d="M4 6L8 10L12 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
