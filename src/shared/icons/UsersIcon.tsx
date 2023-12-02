import { twMerge } from 'tailwind-merge';

type UsersIconProps = JSX.IntrinsicElements['svg'];

export const UsersIcon = ({ className, ...iconProps }: UsersIconProps) => {
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
        d="M28.3334 35V31.6667C28.3334 29.8986 27.631 28.2029 26.3808 26.9526C25.1306 25.7024 23.4349 25 21.6667 25H8.33341C6.5653 25 4.86961 25.7024 3.61937 26.9526C2.36913 28.2029 1.66675 29.8986 1.66675 31.6667V35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9999 18.3333C18.6818 18.3333 21.6666 15.3486 21.6666 11.6667C21.6666 7.98477 18.6818 5 14.9999 5C11.318 5 8.33325 7.98477 8.33325 11.6667C8.33325 15.3486 11.318 18.3333 14.9999 18.3333Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.3333 35.0001V31.6668C38.3322 30.1897 37.8405 28.7548 36.9355 27.5873C36.0305 26.4199 34.7635 25.5861 33.3333 25.2168"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.6667 5.2168C28.1008 5.58397 29.3718 6.41797 30.2795 7.58731C31.1871 8.75666 31.6798 10.1948 31.6798 11.6751C31.6798 13.1554 31.1871 14.5936 30.2795 15.7629C29.3718 16.9323 28.1008 17.7663 26.6667 18.1335"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
