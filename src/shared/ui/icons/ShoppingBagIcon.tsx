import { twMerge } from 'tailwind-merge';

type ShoppingBagIconProps = JSX.IntrinsicElements['svg'];

export const ShoppingBagIcon = ({
  className,
  ...iconProps
}: ShoppingBagIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={twMerge('fill-none stroke-main-dark', className)}
      {...iconProps}
    >
      <path
        d="M7 2.33301L3.5 6.99967V23.333C3.5 23.9518 3.74583 24.5453 4.18342 24.9829C4.621 25.4205 5.21449 25.6663 5.83333 25.6663H22.1667C22.7855 25.6663 23.379 25.4205 23.8166 24.9829C24.2542 24.5453 24.5 23.9518 24.5 23.333V6.99967L21 2.33301H7Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 7H24.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6667 11.667C18.6667 12.9047 18.175 14.0917 17.2999 14.9668C16.4247 15.842 15.2377 16.3337 14 16.3337C12.7624 16.3337 11.5754 15.842 10.7002 14.9668C9.82504 14.0917 9.33337 12.9047 9.33337 11.667"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
