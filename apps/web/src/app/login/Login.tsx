'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthProviders } from './components/AuthProviders';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/inbox');
  } else if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="py-60 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-md">
            <div className="flex flex-col space-y-2 text-center">
              <div className="text-center justify-center items-center space-y-8">
                <div className="w-16 mx-auto">
                  <Logo />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight">Join OpenConductor</h1>
                  <p className="text-md text-muted-foreground">
                    The AI-first orchestration for open source developers.
                  </p>
                </div>
              </div>
            </div>
            <AuthProviders />
            <div className="max-w-sm mx-auto">
              <p className="px-8 text-center text-xs text-muted-foreground">
                By signing up, I acknowledge I read and agree to OpenConductor{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 dark:bg-neutral-900" />
          <div className="absolute top-0 right-0 m-4">
            <ThemeToggle />
          </div>
          <div className="relative z-20 mt-auto"></div>
        </div>
      </div>
    </>
  );
}
