import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const NEXT_AUTH_OPTIONS: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'MoneyTrack',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.SERVER_URL}/auth-token/`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user = await res.json();

        if (res.ok && user) {
          const userInfoResponse = await fetch(
            `${process.env.SERVER_URL}/users/api/get_user_info`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
            },
          );

          const userInfo = await userInfoResponse.json();

          return { ...user, ...userInfo };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
};
