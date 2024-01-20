'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { NavbarMobile } from './ui/NavbarMobile';
import { Breakpoints, useIsBreakpoint } from '@/shared/utils/hooks';

export const Navbar = () => {
  const isDesktop = useIsBreakpoint(Breakpoints.SM);

  const handleSignOut = useCallback(() => signOut(), []);

  const pathname = usePathname();

  if (isDesktop) {
    return null;
  }

  return (
    <div className="mb-6 flex justify-end">
      <NavbarMobile handleSignOut={handleSignOut} pathname={pathname} />
    </div>
  );
};
