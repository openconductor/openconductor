import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Logo({ ...props }) {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return currentTheme === 'dark' ? (
    <Image src="/logo--dark.svg" width="60" height="60" alt="OpenConductor" className="h-20 w-20" {...props} />
  ) : (
    <Image src="/logo--light.svg" width="60" height="60" alt="OpenConductor" className="h-20 w-20" {...props} />
  );
}
