'use client';

import { useEnvironment } from '@/providers/EnvironmentProvider';
import { SettingsIcon } from '@/shared/ui/Icons/SettingsIcon';

export const Navbar = () => {
  const { settingsSidebar } = useEnvironment();

  return (
    <div className="h-16 w-full px-4 shadow-md">
      <div className="flex h-full w-full items-center justify-end">
        <button onClick={settingsSidebar.handleOpen} className="ml-8">
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
