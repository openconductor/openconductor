'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

const examples = [
  {
    name: 'Triage',
    href: '/triage',
  },
  {
    name: 'Review',
    href: '/review',
  },
  {
    name: 'Mail',
    href: '/examples/mail',
  },
  {
    name: 'Dashboard',
    href: '/examples/dashboard',
  },
  {
    name: 'Cards',
    href: '/examples/cards',
  },
  {
    name: 'Playground',
    href: '/examples/playground',
  },
  {
    name: 'Forms',
    href: '/examples/forms',
  },
  {
    name: 'Music',
    href: '/examples/music',
  },
];

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Nav({ className, ...props }: NavProps) {
  const pathname = usePathname();

  return (
    <div className="p-2 relative border-b">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center', className)} {...props}>
            {examples.map((example, index) => (
              <Link
                href={example.href}
                key={example.href}
                className={cn(
                  'flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary',
                  pathname?.startsWith(example.href) || (index === 0 && pathname === '/')
                    ? 'bg-muted font-medium text-primary'
                    : 'text-muted-foreground',
                )}
              >
                {example.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
