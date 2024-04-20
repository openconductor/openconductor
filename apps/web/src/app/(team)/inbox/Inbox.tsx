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
    {
      type: MessageType.TRIAGE,
    },
    {
      enabled: true,
    },
  );

  const filteredContribute = messages?.filter((message) =>
    message.labels.some((label) => label.name === 'good first issue'),
  );

  const filteredFix = messages?.filter((message) => message.labels.some((label) => label.name === 'bug'));

  return (
    <>
      <Tabs defaultValue="contribute">
        <div className="flex items-center px-4 py-2 h-[52px]">
          <h1 className="text-lg font-medium">Inbox</h1>
          <TabsList className="ml-auto">
            <TabsTrigger value="contribute" className="text-neutral-600 dark:text-neutral-200">
              Contribute
            </TabsTrigger>
            <TabsTrigger value="fix" className="text-neutral-600 dark:text-neutral-200">
              Fix bugs
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
        <TabsContent value="contribute" className="m-0">
          {messagesStatus === 'success' && <InboxList messages={filteredContribute} />}
        </TabsContent>
        <TabsContent value="fix" className="m-0">
          {messagesStatus === 'success' && <InboxList messages={filteredFix} />}
        </TabsContent>
      </Tabs>
    </>
  );
}
