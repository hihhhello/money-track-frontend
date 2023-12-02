type PlusIconProps = JSX.IntrinsicElements['svg'];

export const PlusIcon = ({ ...iconProps }: PlusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      {...iconProps}
    >
      <path
        d="M12 5V19"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
