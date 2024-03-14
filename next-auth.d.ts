import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      id: number;
      email: string;
    };
  }

  interface User {
    accessToken: string;
    id: number;
    email: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    id: number;
    email: string;
  }
}
