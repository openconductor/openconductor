'use client';

import { ReactNode, KeyboardEvent, forwardRef } from 'react';
import { Drawer, Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerContent = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn('fixed inset-x-0 bottom-0 z-50 mt-24 h-[96%] rounded-t-[10px] bg-background', className)}
      {...props}
    >
      <div className="absolute left-1/2 top-3 h-2 w-[100px] translate-x-[-50%] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
));
DrawerContent.displayName = 'DrawerContent';

export { DrawerTrigger, DrawerContent };

export const SideDrawer = ({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Close drawer on Escape key press
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(newOpenState) => (newOpenState ? undefined : onClose())}
      direction="right"
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 dark:bg-black/15"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
        />
        <Drawer.Content className="border-l-2 border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 flex flex-col overflow-auto h-full w-11/12 sm:max-w-screen-xl mt-24 fixed bottom-0 right-0 focus:outline-none">
          {/* Ensure the div is focusable and has a role. Add onKeyDown to handle keyboard events. */}
          <div onKeyDown={handleKeyDown} tabIndex={-1} role="presentation">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
