import Navigation from './navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: userData, status: userStatus } = useSession();
  const router = useRouter();

  if (userStatus === 'loading') {
    return <></>;
  }

  if (userStatus === 'unauthenticated' || !userData) {
    void router.push('/login');
    return null;
  }
  return (
    <>
      <div className="h-screen">
        <Navigation />
        <div
          className="h-screen bg-repeat p-8"
          style={{
            backgroundImage: `url('/grid--light.svg')`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
