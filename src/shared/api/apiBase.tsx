import axios from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';

import { NEXT_AUTH_OPTIONS } from '../utils/nextAuth';

export const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await (async () => {
    if (typeof window === 'undefined') {
      return await getServerSession(NEXT_AUTH_OPTIONS);
    }
    return await getSession();
  })();

  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session?.user?.token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      toast('Something went wrong. Try again.', {
        type: 'error',
      });
    }

    return Promise.reject(error);
  },
);
