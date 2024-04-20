import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

interface LayoutProps {
  children: React.ReactNode;
  message: React.ReactNode;
}

export default async function Layout({ children, message }: LayoutProps) {
  return (
    <>
      <ResizablePanel defaultSize={37} minSize={37}>
        {children}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={63}>{message}</ResizablePanel>
    </>
  );
}
