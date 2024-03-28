import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useBoolean } from 'hihhhello-utils';
import Link from 'next/link';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

import { BurgerMenuIcon } from '@/shared/icons/BurgerMenuIcon';
import { SignOutIcon } from '@/shared/icons/SignOutIcon';

type NavbarMobileProps = {
  handleSignOut: () => void;
  pathname: string;
};

export const NavbarMobile = ({
  pathname,
  handleSignOut,
}: NavbarMobileProps) => {
  const menuOpenState = useBoolean(false);

  const handleCloseMenu = useCallback(() => {
    menuOpenState.setFalse();
    document.body.style.overflow = 'unset';
  }, [menuOpenState]);

  const handleOpenMenu = useCallback(() => {
    menuOpenState.setTrue();
    document.body.style.overflow = 'hidden';
  }, [menuOpenState]);

  return (
    <div>
      <button onClick={handleOpenMenu}>
        <BurgerMenuIcon />
      </button>

      <Dialog
        open={menuOpenState.value}
        onClose={handleCloseMenu}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-white px-4">
          <Dialog.Panel className="flex h-full w-full items-center justify-center">
            <div className="absolute top-1">
              <div className="flex items-center">
                <button
                  onClick={handleSignOut}
                  className="ml-6 rounded-lg bg-main-blue p-2"
                >
                  <SignOutIcon className="text-white" />
                </button>
              </div>
            </div>

            <button
              onClick={handleCloseMenu}
              className="absolute right-4 top-4 h-6 w-6"
            >
              <XMarkIcon />
            </button>

            <div className="flex w-60 flex-col items-center justify-center gap-8">
              <Link
                href="/"
                onClick={handleCloseMenu}
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/' && 'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Home</span>
              </Link>

              <Link
                href="/categories"
                onClick={handleCloseMenu}
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/categories' && 'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Categories</span>
              </Link>

              <Link
                href="/recurrent-transactions"
                onClick={handleCloseMenu}
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/recurrent-transactions' &&
                    'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Recurrent</span>
              </Link>

              <Link
                href="/spending-groups"
                onClick={handleCloseMenu}
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/spending-groups' && 'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Groups</span>
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
