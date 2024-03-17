import { ResizablePanel } from '@/components/ui/resizable';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <ResizablePanel defaultSize={85} minSize={85}>
      {children}
    </ResizablePanel>
  );
}
