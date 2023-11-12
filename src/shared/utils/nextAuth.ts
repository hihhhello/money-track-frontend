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
        console.log('credentials', credentials);

        const res = await fetch(`${process.env.SERVER_URL}/signin`, {
          method: 'POST',
          body: JSON.stringify({
            password: credentials?.password,
            email: credentials?.username,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const user = await res.json();

        console.log('user', user);

        if (res.ok && user) {
          const userInfoResponse = await fetch(`${process.env.SERVER_URL}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.access_token}`,
            },
          });

          const userInfo = await userInfoResponse.json();

          console.log('userInfo', userInfo);

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
};
