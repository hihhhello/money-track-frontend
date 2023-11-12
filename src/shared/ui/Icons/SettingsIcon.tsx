import { twMerge } from 'tailwind-merge';

type SettingsIconProps = JSX.IntrinsicElements['svg'];

export const SettingsIcon = ({
  className,
  ...iconProps
}: SettingsIconProps) => {
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
        d="M20.5 25C23.2614 25 25.5 22.7614 25.5 20C25.5 17.2386 23.2614 15 20.5 15C17.7386 15 15.5 17.2386 15.5 20C15.5 22.7614 17.7386 25 20.5 25Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.8334 25.0003C32.6116 25.503 32.5454 26.0606 32.6434 26.6013C32.7414 27.142 32.9992 27.6409 33.3834 28.0337L33.4834 28.1337C33.7933 28.4432 34.0392 28.8109 34.2069 29.2155C34.3747 29.6202 34.461 30.0539 34.461 30.492C34.461 30.93 34.3747 31.3638 34.2069 31.7685C34.0392 32.1731 33.7933 32.5407 33.4834 32.8503C33.1738 33.1602 32.8062 33.4061 32.4016 33.5739C31.9969 33.7416 31.5631 33.8279 31.1251 33.8279C30.687 33.8279 30.2533 33.7416 29.8486 33.5739C29.444 33.4061 29.0763 33.1602 28.7667 32.8503L28.6667 32.7503C28.274 32.3661 27.7751 32.1084 27.2344 32.0103C26.6937 31.9123 26.1361 31.9785 25.6334 32.2003C25.1405 32.4116 24.7201 32.7624 24.4239 33.2096C24.1278 33.6567 23.9689 34.1807 23.9667 34.717V35.0003C23.9667 35.8844 23.6156 36.7322 22.9904 37.3573C22.3653 37.9825 21.5175 38.3337 20.6334 38.3337C19.7494 38.3337 18.9015 37.9825 18.2764 37.3573C17.6513 36.7322 17.3001 35.8844 17.3001 35.0003V34.8503C17.2872 34.2987 17.1086 33.7637 16.7876 33.3148C16.4666 32.866 16.018 32.5241 15.5001 32.3337C14.9974 32.1118 14.4398 32.0456 13.8991 32.1437C13.3584 32.2417 12.8595 32.4994 12.4667 32.8837L12.3667 32.9837C12.0572 33.2936 11.6895 33.5394 11.2849 33.7072C10.8802 33.8749 10.4465 33.9613 10.0084 33.9613C9.57036 33.9613 9.13661 33.8749 8.73195 33.7072C8.32729 33.5394 7.95966 33.2936 7.65008 32.9837C7.34016 32.6741 7.0943 32.3065 6.92655 31.9018C6.7588 31.4971 6.67246 31.0634 6.67246 30.6253C6.67246 30.1873 6.7588 29.7535 6.92655 29.3489C7.0943 28.9442 7.34016 28.5766 7.65008 28.267L7.75008 28.167C8.13431 27.7742 8.39206 27.2753 8.49009 26.7346C8.58812 26.194 8.52194 25.6364 8.30008 25.1337C8.08881 24.6407 7.73801 24.2203 7.29086 23.9242C6.84371 23.628 6.31973 23.4691 5.78342 23.467H5.50008C4.61603 23.467 3.76818 23.1158 3.14306 22.4907C2.51794 21.8656 2.16675 21.0177 2.16675 20.1337C2.16675 19.2496 2.51794 18.4018 3.14306 17.7766C3.76818 17.1515 4.61603 16.8003 5.50008 16.8003H5.65008C6.20174 16.7874 6.73676 16.6089 7.18558 16.2878C7.6344 15.9668 7.97627 15.5182 8.16675 15.0003C8.38861 14.4976 8.45479 13.94 8.35676 13.3993C8.25872 12.8587 8.00098 12.3598 7.61675 11.967L7.51675 11.867C7.20683 11.5574 6.96096 11.1898 6.79322 10.7851C6.62547 10.3805 6.53913 9.94671 6.53913 9.50866C6.53913 9.07061 6.62547 8.63685 6.79322 8.23219C6.96096 7.82753 7.20683 7.4599 7.51675 7.15033C7.82633 6.8404 8.19395 6.59454 8.59861 6.42679C9.00327 6.25905 9.43703 6.1727 9.87508 6.1727C10.3131 6.1727 10.7469 6.25905 11.1515 6.42679C11.5562 6.59454 11.9238 6.8404 12.2334 7.15033L12.3334 7.25033C12.7262 7.63455 13.2251 7.8923 13.7658 7.99033C14.3064 8.08836 14.8641 8.02218 15.3667 7.80033H15.5001C15.993 7.58905 16.4134 7.23825 16.7096 6.7911C17.0057 6.34395 17.1646 5.81997 17.1667 5.28366V5.00033C17.1667 4.11627 17.5179 3.26842 18.1431 2.6433C18.7682 2.01818 19.616 1.66699 20.5001 1.66699C21.3841 1.66699 22.232 2.01818 22.8571 2.6433C23.4822 3.26842 23.8334 4.11627 23.8334 5.00033V5.15033C23.8356 5.68664 23.9945 6.21062 24.2906 6.65777C24.5867 7.10492 25.0071 7.45572 25.5001 7.66699C26.0028 7.88885 26.5604 7.95503 27.1011 7.857C27.6417 7.75897 28.1406 7.50122 28.5334 7.11699L28.6334 7.01699C28.943 6.70707 29.3106 6.46121 29.7153 6.29346C30.1199 6.12571 30.5537 6.03937 30.9917 6.03937C31.4298 6.03937 31.8636 6.12571 32.2682 6.29346C32.6729 6.46121 33.0405 6.70707 33.3501 7.01699C33.66 7.32657 33.9059 7.6942 34.0736 8.09886C34.2414 8.50352 34.3277 8.93727 34.3277 9.37533C34.3277 9.81338 34.2414 10.2471 34.0736 10.6518C33.9059 11.0565 33.66 11.4241 33.3501 11.7337L33.2501 11.8337C32.8659 12.2265 32.6081 12.7254 32.5101 13.266C32.412 13.8067 32.4782 14.3643 32.7001 14.867V15.0003C32.9114 15.4933 33.2622 15.9137 33.7093 16.2098C34.1565 16.5059 34.6804 16.6649 35.2167 16.667H35.5001C36.3841 16.667 37.232 17.0182 37.8571 17.6433C38.4822 18.2684 38.8334 19.1163 38.8334 20.0003C38.8334 20.8844 38.4822 21.7322 37.8571 22.3573C37.232 22.9825 36.3841 23.3337 35.5001 23.3337H35.3501C34.8138 23.3358 34.2898 23.4947 33.8426 23.7908C33.3955 24.087 33.0447 24.5074 32.8334 25.0003Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};