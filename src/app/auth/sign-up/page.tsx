import { getServerSession } from 'next-auth';
import { SignUpPageContent } from './_ui/SignUpPageContent';
import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';
import { redirect } from 'next/navigation';

const AuthSignUpPage = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  if (session?.user) {
    return redirect('/');
  }

  return <SignUpPageContent />;
};

export default AuthSignUpPage;
