import { useTheme } from 'next-themes';
import toast, { ToastBar, Toaster as HotToaster } from 'react-hot-toast';

export const Toaster = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        className:
          currentTheme == 'dark'
            ? '!bg-neutral-800 !text-white !r-text-body-2 !rounded-full'
            : '!bg-white !text-neutral-900 !r-text-body-2 !rounded-full',
        style: {
          maxWidth: '500px',
        },
        iconTheme: {
          primary: '#4f46e5',
          secondary: '#ffffff',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex" onClick={() => toast.dismiss(t.id)}>
              {icon}
              {message}
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
};
