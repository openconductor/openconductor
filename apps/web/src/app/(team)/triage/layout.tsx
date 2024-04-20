import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

interface LayoutProps {
  children: React.ReactNode;
  message: React.ReactNode;
}

export default async function Layout({ children, message }: LayoutProps) {
  return (
    <>
      <ResizablePanel defaultSize={70} minSize={25}>
        {children}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>{message}</ResizablePanel>
    </>
  );
}
