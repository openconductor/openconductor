import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme';
import { Nav } from '@/components/nav';
import { TrpcProvider } from '@/providers/trpc';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TrpcProvider>
            <Nav />
            {children}
          </TrpcProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
