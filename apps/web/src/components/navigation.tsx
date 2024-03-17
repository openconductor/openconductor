'use client';
import * as React from 'react';
import { Blocks, Cog, Inbox, Split, SquareStack } from 'lucide-react';

import { AccountSwitcher } from '@/app/examples/mail/components/account-switcher';
import { Nav } from '@/app/examples/mail/components/nav';
import { accounts } from '@/app/examples/mail/data';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

export function Navigation({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px] px-2.5' : 'px-2')}>
        {!isCollapsed && (
          <div className="flex items-center">
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
        )}
        <div className="flex items-center space-x-2">
          {!isCollapsed && <ThemeToggle />}
          <UserNav />
        </div>
      </div>
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            href: '/inbox',
            title: 'Inbox',
            label: '128',
            icon: Inbox,
          },
          {
            href: '/triage',
            title: 'Triage',
            label: '9',
            icon: Split,
          },
          {
            href: '/review',
            title: 'Review',
            label: '',
            icon: SquareStack,
          },
          {
            href: '/sources',
            title: 'Sources',
            label: '',
            icon: Blocks,
          },
          // {
          //   title: 'Junk',
          //   label: '23',
          //   icon: ArchiveX,
          //   variant: 'ghost',
          // },
          // {
          //   title: 'Trash',
          //   label: '',
          //   icon: Trash2,
          //   variant: 'ghost',
          // },
          // {
          //   title: 'Archive',
          //   label: '',
          //   icon: Archive,
          //   variant: 'ghost',
          // },
        ]}
      />
    </>
  );
}
