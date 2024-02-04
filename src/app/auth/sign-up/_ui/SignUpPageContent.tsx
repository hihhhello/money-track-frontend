'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { api } from '@/shared/api/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLoadingToast } from '@/shared/utils/hooks';

export const SignUpPageContent = () => {
  const loadingToast = useLoadingToast();
  const router = useRouter();

  const session = useSession();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const toastId = loadingToast.showLoading('Creating your account...');

    if (!email || !password) {
      return;
    }

    api.auth
      .register({
        body: {
          email,
          password,
        },
      })
      .then(() => {
        loadingToast.handleSuccess({
          toastId,
          message: 'Account has been created.',
        });
        toast.info('Please, sign in to use the app.');

        router.push('/api/auth/signin');
      })
      .catch(() => {
        loadingToast.handleError({
          toastId,
          message:
            'Something gone wrong while creating your account. Try again.',
        });
      });
  };

  return (
    <div className="flex min-h-full flex-grow flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                value={email ?? ''}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm leading-6 text-gray-900"
            >
              Password
            </label>

            <div className="mt-2">
              <input
                value={password ?? ''}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <Link
            href="/auth/sign-in"
            className="ml-1 leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
