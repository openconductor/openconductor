'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Navigation } from './navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch "
      >
        <ResizablePanel
          defaultSize={15}
          collapsedSize={2}
          collapsible={true}
          minSize={2}
          maxSize={15}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = 'react-resizable-panels:collapsed=true';
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = 'react-resizable-panels:collapsed=false';
          }}
          className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
        >
          <Navigation isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        {children}
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
