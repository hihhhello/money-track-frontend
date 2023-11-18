import { getServerSession } from 'next-auth';
import { SignInPageContent } from './_ui/SignInPageContent';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { redirect } from 'next/navigation';

const AuthSignInPage = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  if (session?.user) {
    return redirect('/');
  }

  return <SignInPageContent />;
};

export default AuthSignInPage;
