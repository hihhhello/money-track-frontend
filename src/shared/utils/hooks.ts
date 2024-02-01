'use client';

import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Id, toast } from 'react-toastify';

export const useLoadingToast = () => {
  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const handleSuccess = useCallback(
    ({ message, toastId }: { toastId: Id; message: string }) => {
      toast.update(toastId, {
        render: message,
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      });
    },
    [],
  );

  const handleError = useCallback(
    ({ message, toastId }: { toastId: Id; message: string }) => {
      toast.update(toastId, {
        render: message,
        type: 'error',
        isLoading: false,
        autoClose: 1500,
      });
    },
    [],
  );

  return useMemo(
    () => ({
      showLoading,
      handleSuccess,
      handleError,
    }),
    [handleError, handleSuccess, showLoading],
  );
};

export enum Breakpoints {
  'SM' = 640,
  'MD' = 768,
  'LG' = 1024,
  'XL' = 1280,
  '2XL' = 1536,
}

export const useIsBreakpoint = (breakpoint: Breakpoints | number) => {
  const [width, setWidth] = useState(0);
  const handleWindowSizeChange = debounce(() => {
    setWidth(window.innerWidth);
  }, 150);

  useEffect(() => {
    handleWindowSizeChange();

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  return width > breakpoint;
};

export const useBoolean = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  const setFalse = useCallback(() => setValue(false), []);
  const setTrue = useCallback(() => setValue(true), []);
  const toggle = useCallback(() => setValue((prevValue) => !prevValue), []);

  return useMemo(
    () => ({
      value,
      setFalse,
      setTrue,
      toggle,
      setValue,
    }),
    [setFalse, setTrue, toggle, value],
  );
};
