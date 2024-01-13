import { Dialog } from '@headlessui/react';
import { useCallback, useState } from 'react';
import Link from 'next/link';

import { BurgerMenuIcon } from '@/shared/icons/BurgerMenuIcon';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { SignOutIcon } from '@/shared/icons/SignOutIcon';

type NavbarMobileProps = {
  handleSignOut: () => void;
  pathname: string;
};

export const NavbarMobile = ({
  pathname,
  handleSignOut,
}: NavbarMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div>
      <button onClick={handleOpenMenu}>
        <BurgerMenuIcon className="text-primary-blue" />
      </button>

      <Dialog
        open={isMenuOpen}
        onClose={handleCloseMenu}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-main-paper px-4">
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

              {/* {me ? (
                <div className="flex items-center text-primary-blue">
                  {me.name && <p>{me.name}</p>}

                  {me.image && (
                    <Image
                      src={me.image}
                      alt="Profile image"
                      className="ml-1 h-12 w-12 rounded-full"
                      height={48}
                      width={48}
                    />
                  )}

                  <button
                    onClick={handleSignOut}
                    className="ml-6 rounded-lg bg-primary-blue p-2"
                  >
                    <SignOutIcon className="text-white" />
                  </button>
                </div>
              ) : !me && isAuthenticating ? (
                <div className="h-10 w-[108px] animate-pulse rounded-3xl bg-slate-200"></div>
              ) : (
                <LogInButton className="rounded-3xl bg-primary-blue px-8 py-2 text-white" />
              )} */}
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
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/' && 'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Dashboard</span>
              </Link>

              <Link
                href="/categories"
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/categories' && 'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Categories</span>
              </Link>

              <Link
                href="/recurrent-transactions"
                className={twMerge(
                  'w-full rounded-full bg-main-blue px-4 py-2 text-center text-white',
                  pathname === '/recurrent-transactions' &&
                    'bg-main-dark text-white',
                )}
              >
                <span className="text-xl leading-tight">Recurrent</span>
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};