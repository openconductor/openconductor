import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

interface ExamplesLayoutProps {
  children: React.ReactNode;
  message: React.ReactNode;
}

export default async function ExamplesLayout({ children, message }: ExamplesLayoutProps) {
  return (
    <>
      <ResizablePanel defaultSize={30} minSize={30}>
        {children}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>{message}</ResizablePanel>
    </>
  );
}
