import axios, { AxiosError } from 'axios';
import { getServerSession } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

import { NEXT_AUTH_OPTIONS } from '../utils/nextAuth';

export const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
});

/**
 * Token  middleware
 */
axiosInstance.interceptors.request.use(async (config) => {
  const session = await (async () => {
    if (typeof window === 'undefined') {
      return await getServerSession(NEXT_AUTH_OPTIONS);
    }
    return await getSession();
  })();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
  }

  return config;
});

/**
 * Error handler middleware
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      /**
       * TODO: add refresh token logic
       */
      // signOut();

      toast('Unauthorized', {
        type: 'error',
        toastId: '401-error-toast',
      });
    } else {
      toast('Something went wrong. Try again.', {
        type: 'error',
        toastId: 'other-error-toast',
      });
    }

    return Promise.reject(error);
  },
);
