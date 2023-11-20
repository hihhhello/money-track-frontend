'use client';

import { ReactNode, createContext, useContext, useMemo } from 'react';

import { useBoolean } from '@/shared/utils/hooks';

type EnvironmentContextType = {
  settingsSidebar: {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
  };
};

const ENVIRONMENT_CONTEXT_DEFAULT_VALUES: EnvironmentContextType = {
  settingsSidebar: {
    isOpen: false,
    handleClose: () => {},
    handleOpen: () => {},
  },
};

const EnvironmentContext = createContext(ENVIRONMENT_CONTEXT_DEFAULT_VALUES);

export const useEnvironment = () => useContext(EnvironmentContext);

type EnvironmentProviderProps = {
  children: ReactNode;
};

export const EnvironmentProvider = ({ children }: EnvironmentProviderProps) => {
  const {
    value: isSettingsSidebarOpen,
    setFalse: handleCloseSettingsSidebar,
    setTrue: handleOpenSettingsSidebar,
  } = useBoolean(false);

  const values: EnvironmentContextType = useMemo(
    () => ({
      settingsSidebar: {
        handleClose: handleCloseSettingsSidebar,
        handleOpen: handleOpenSettingsSidebar,
        isOpen: isSettingsSidebarOpen,
      },
    }),
    [
      handleCloseSettingsSidebar,
      handleOpenSettingsSidebar,
      isSettingsSidebarOpen,
    ],
  );

  return (
    <EnvironmentContext.Provider value={values}>
      {children}
    </EnvironmentContext.Provider>
  );
};
