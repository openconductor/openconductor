import { Nav } from '@/components/nav';
import { getCurrentUser } from '@/lib/session';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Check out some examples app built using the components.',
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default async function ExamplesLayout({ children }: ExamplesLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <>
      <Nav />
      <div>{children}</div>
    </>
  );
}
