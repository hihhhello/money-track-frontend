'use client';

import { FormEvent, useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useBoolean } from 'hihhhello-utils';
import { toast } from 'react-toastify';

export const SignInPageContent = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const { value: isLoading, setValue: setIsLoading } = useBoolean(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    signIn('credentials', {
      username: email,
      password: password,
    })
      .catch(() => {
        toast.error('Something gone wrong while signing in. Try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex min-h-full flex-grow flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900">
          Sign in into MoneyTrack account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" datatype="login">
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
                datatype="username"
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
                datatype="password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t have an account?
          <Link
            href="/auth/sign-up"
            className="ml-1 leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create a new account
          </Link>
        </p>
      </div>
    </div>
  );
};
