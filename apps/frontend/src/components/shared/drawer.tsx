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
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

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
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/25"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
        />
        <Drawer.Content className="border-2 border-l border-gray-600 bg-gray-800 flex flex-col overflow-auto h-full w-[1024px] mt-24 fixed bottom-0 right-0 focus:outline-none">
          {/* Ensure the div is focusable and has a role. Add onKeyDown to handle keyboard events. */}
          <div onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={-1} role="presentation">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
