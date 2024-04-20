import clsx from 'clsx';

export const SpinIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}
export default function Button({ children, variant = ButtonVariant.Secondary, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={clsx(
        variant === ButtonVariant.Primary ? ' border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500' : '',
        variant === ButtonVariant.Secondary
          ? 'border-neutral-200 dark:border-neutral-700 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-200'
          : '',
        variant === ButtonVariant.Tertiary ? 'border-indigo-700 bg-white text-indigo-500 hover:bg-indigo-50' : '',
        'mx-1  px-5 py-1.5 text-sm font-semibold border rounded-md shadow-sm items-center justify-center inline-flex',
      )}
    >
      {children}
    </button>
  );
}
