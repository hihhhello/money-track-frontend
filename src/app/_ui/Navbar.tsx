'use client';

import { SettingsIcon } from '@/shared/ui/Icons/SettingsIcon';
import { signOut } from 'next-auth/react';

export const Navbar = () => {
  return (
    <div className="h-16 w-full px-4 shadow-md">
      <div className="flex h-full w-full items-center justify-end">
        <button
          onClick={() => signOut()}
          className="rounded bg-indigo-600 px-3 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign Out
        </button>

        <button className="ml-8">
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
