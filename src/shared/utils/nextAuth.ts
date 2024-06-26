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
      async authorize(credentials) {
        try {
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

          const user: { access_token: string } = await res.json();

          if (res.ok && user) {
            const userInfoResponse = await fetch(
              `${process.env.SERVER_URL}/me`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.access_token}`,
                },
              },
            );

            const userInfo: { email: string; id: string } =
              await userInfoResponse.json();

            return {
              accessToken: user.access_token,
              ...userInfo,
              id: Number(userInfo.id),
            };
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = Number(user.id);
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token;

      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
};
