import { Layout } from '@/components/layout';
import { getCurrentUser } from '@/lib/session';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'OpenConductor',
  description: 'OpenConductor',
};

interface TeamLayoutProps {
  children: React.ReactNode;
}

export default async function TeamLayout({ children }: TeamLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return <Layout>{children}</Layout>;
}
