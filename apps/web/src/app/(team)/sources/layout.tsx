import { ResizablePanel } from '@/components/ui/resizable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sources',
};

interface LayoutProps {
  children: React.ReactNode;
  message: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <ResizablePanel defaultSize={85} minSize={85}>
      {children}
    </ResizablePanel>
  );
}
