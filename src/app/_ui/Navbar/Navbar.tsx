'use client';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { NavbarMobile } from './ui/NavbarMobile';

export const Navbar = () => {
  const handleSignOut = useCallback(() => signOut(), []);

  const pathname = usePathname();

  return (
    <div className="mb-3 flex justify-end sm:hidden">
      <NavbarMobile handleSignOut={handleSignOut} pathname={pathname} />
    </div>
  );
};
