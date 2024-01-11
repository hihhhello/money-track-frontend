'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { NavbarMobile } from './ui/NavbarMobile';
import { useIsBreakpoint } from '@/shared/utils/hooks';

export const Navbar = () => {
  const isDesktop = useIsBreakpoint(1100);

  const handleSignOut = useCallback(() => signOut(), []);

  const pathname = usePathname();

  if (isDesktop) {
    return null;
  }

  return <NavbarMobile handleSignOut={handleSignOut} pathname={pathname} />;
};
