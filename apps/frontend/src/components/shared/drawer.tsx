import { ReactNode, KeyboardEvent } from 'react';
import { Drawer } from 'vaul';

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
        <Drawer.Overlay className="fixed inset-0 bg-black/25" onKeyDown={handleKeyDown} tabIndex={0} role="button" />
        <Drawer.Content className="border-l-2 border-neutral-800 bg-neutral-950 flex flex-col overflow-auto h-full w-11/12 sm:max-w-screen-xl mt-24 fixed bottom-0 right-0 focus:outline-none">
          {/* Ensure the div is focusable and has a role. Add onKeyDown to handle keyboard events. */}
          <div onKeyDown={handleKeyDown} tabIndex={-1} role="presentation">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
