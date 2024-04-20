'use client';
import * as React from 'react';
import { Blocks, Inbox, Split, SquareStack } from 'lucide-react';

import { AccountSwitcher } from '@/app/examples/mail/components/account-switcher';
import { Nav } from '@/app/examples/mail/components/nav';
import { accounts } from '@/app/examples/mail/data';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { UserNav } from './user-nav';
import { api } from '@/lib/api';
import { MessageType } from '@openconductor/db';
import Logo from './logo';

export function Navigation({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: triageMessages, status: reviewMessagesStatus } = api.message.count.useQuery(
    { type: MessageType.REVIEW },
    {
      enabled: true,
    },
  );

  const { data: reviewMessages, status: triageMessagesStatus } = api.message.count.useQuery(
    { type: MessageType.TRIAGE },
    {
      enabled: true,
    },
  );

  return (
    <>
      <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px] px-2.5' : 'px-2')}>
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="flex items-center space-x-2 opacity-50 hover:opacity-100 cursor-pointer">
              <Logo className="h-6 w-6" />
              <p className="font-medium">OpenConductor</p>
            </div>
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
        )}
        <div className="flex items-center space-x-2">
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
            label: `${triageMessagesStatus === 'success' && triageMessages?._count}`,
            icon: Split,
          },
          {
            href: '/review',
            title: 'Review',
            label: `${reviewMessagesStatus === 'success' && reviewMessages?._count}`,
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
