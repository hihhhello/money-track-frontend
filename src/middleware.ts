export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth/sign-up
     * - manifest
     * - android, ios, windows11
     */
    '/((?!auth|manifest|android|ios|windows11).*)',
  ],
};
