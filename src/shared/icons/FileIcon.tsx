import { twMerge } from 'tailwind-merge';

type FileIconProps = JSX.IntrinsicElements['svg'];

export const FileIcon = ({ className, ...iconProps }: FileIconProps) => {
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
        d="M21.6667 3.33301H10.0001C9.11603 3.33301 8.26818 3.6842 7.64306 4.30932C7.01794 4.93444 6.66675 5.78229 6.66675 6.66634V33.333C6.66675 34.2171 7.01794 35.0649 7.64306 35.69C8.26818 36.3152 9.11603 36.6663 10.0001 36.6663H30.0001C30.8841 36.6663 31.732 36.3152 32.3571 35.69C32.9822 35.0649 33.3334 34.2171 33.3334 33.333V14.9997L21.6667 3.33301Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6667 3.33301V14.9997H33.3334"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
