'use client';
import * as React from 'react';
import { Search } from 'lucide-react';

import { InboxList } from '@/app/(team)/inbox/InboxList';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { MessageType } from '@openconductor/db';

export function Inbox() {
  const { data: messages, status: messagesStatus } = api.message.all.useQuery(
    { type: MessageType.TRIAGE },
    {
      enabled: true,
    },
  );

  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center px-4 py-2 h-[52px]">
          <h1 className="text-lg font-medium">Inbox</h1>
          <TabsList className="ml-auto">
            <TabsTrigger value="all" className="text-neutral-600 dark:text-neutral-200">
              One
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-neutral-600 dark:text-neutral-200">
              Two
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </form>
        </div>
        <TabsContent value="all" className="m-0">
          {messagesStatus === 'success' && <InboxList messages={messages} />}
        </TabsContent>
      </Tabs>
    </>
  );
}
