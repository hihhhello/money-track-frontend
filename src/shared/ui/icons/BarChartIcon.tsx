import { twMerge } from 'tailwind-merge';

type BarChartIconProps = JSX.IntrinsicElements['svg'];

export const BarChartIcon = ({
  className,
  ...iconProps
}: BarChartIconProps) => {
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
        d="M30 33.3337V16.667"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 33.3337V6.66699"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 33.333V23.333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
