import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import AuthLayout from '~/components/layouts/authLayout';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    console.log({ error });
    if (error === 'OAuthAccountNotLinked') {
      toast.error(
        'Looks like you already have an account with us - please sign in with the same account you used to sign up.',
      );
    }
  }, [error]);

  if (status === 'authenticated') {
    void router.push('/');
    return;
  } else if (status === 'loading') {
    return <div>Loading...</div>;
  }
  return (
    <AuthLayout
      mode="login"
      onGoogleSignIn={onGoogleSignIn}
      onDiscordSignIn={onDiscordSignIn}
      onGithubSignIn={onGithubSignIn}
      onTwitterSignIn={onTwitterSignIn}
    />
  );

  function onGoogleSignIn() {
    signIn('google').catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(error.message);
    });
  }

  function onDiscordSignIn() {
    signIn('discord').catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(error.message);
    });
  }

  function onGithubSignIn() {
    signIn('github').catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(error.message);
    });
  }

  function onTwitterSignIn() {
    signIn('twitter').catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(error.message);
    });
  }
}
