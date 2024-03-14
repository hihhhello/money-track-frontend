import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { SignInPageContent } from './_ui/SignInPageContent';

const AuthSignInPage = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  if (session?.user) {
    return redirect('/');
  }

  return <SignInPageContent />;
};

export default AuthSignInPage;
