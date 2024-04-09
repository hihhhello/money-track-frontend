'use client';

import { ReactNode, createContext, useContext, useMemo } from 'react';

/**
 * TODO: update when global values are added.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type EnvironmentContextType = {};

const ENVIRONMENT_CONTEXT_DEFAULT_VALUES: EnvironmentContextType = {};

const EnvironmentContext = createContext(ENVIRONMENT_CONTEXT_DEFAULT_VALUES);

export const useEnvironment = () => useContext(EnvironmentContext);

type EnvironmentProviderProps = {
  children: ReactNode;
};

export const EnvironmentProvider = ({ children }: EnvironmentProviderProps) => {
  const values: EnvironmentContextType = useMemo(() => ({}), []);

  return (
    <EnvironmentContext.Provider value={values}>
      {children}
    </EnvironmentContext.Provider>
  );
};
