'use client';

import { columns } from './columns';
import { DataTable } from './components/data-table';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Message as MessageDb, MessageType } from '@openconductor/db';
import { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useMessage } from './use-message';

export type ResponseSummary = {
  summary: string;
  bullets: string[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export default function TriageTable({ type, contribute }: { type: MessageType; contribute?: boolean }) {
  const { selectedMessage, selectMessage } = useMessage();

  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();

  const {
    data: messages,
    status: messagesStatus,
    refetch,
  } = api.message.all.useQuery(
    { type },
    {
      enabled: true,
    },
  );

  const { mutateAsync: refreshMessages, isLoading: isRefreshing } = api.message.refresh.useMutation();
  const { mutateAsync: recommendMessages, isLoading: isRecommending } = api.message.recommend.useMutation();

  const handleRefreshMessages = async () => {
    await refreshMessages({ teamId: teamData?.id ?? '' });
    refetch();
  };

  const handleRecommendMessages = async () => {
    await recommendMessages({ teamId: teamData?.id ?? '' });
    refetch();
  };

  const handleRowClick = (row: { original: { id: string } }) => {
    const message = messages?.find((message) => message.id === row.original.id);
    if (message) {
      selectMessage(message);
    }
  };

  useEffect(() => {
    if (!selectedMessage && messages?.[0]) {
      selectMessage(messages[0]);
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && messages && messages.length > 0) {
        event.preventDefault();
        const currentIndex = messages.findIndex((message: MessageDb) => message.id === selectedMessage?.id);
        let newIndex = currentIndex;

        if (event.key === 'ArrowUp') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
        } else if (event.key === 'ArrowDown') {
          newIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
        }

        const newSelectedMessageId = messages[newIndex]?.id;
        if (newSelectedMessageId) {
          const message = messages?.find((message: MessageDb) => message.id === newSelectedMessageId);
          if (message) {
            selectMessage(message);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, selectedMessage]);

  if (teamStatus !== 'success' || messagesStatus !== 'success') {
    return <></>;
  }

  const dataTable =
    messages.map((message) => ({
      id: message.id,
      key: message.key,
      source: message.source.sourceId,
      title: message.title,
      body: message.body,
      url: message.url,
      createdAt: message.createdAt,
      author: {
        ...message.author,
      },
      status: message.state,
      labels: message.labels,
      summary: (message.aiItems?.[0]?.response as unknown as ResponseSummary)?.summary,
      priority: (message.aiItems?.[0]?.response as unknown as ResponseSummary)?.priority,
    })) ?? [];

  const filteredDataTable = dataTable.filter((item) => item.labels.some((label) => label.name === 'good first issue'));

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between ">
        <h1 className="text-lg font-medium">
          {type === MessageType.TRIAGE && !contribute && 'Triage'}
          {type === MessageType.TRIAGE && contribute && 'Contribute'}
          {type === MessageType.REVIEW && 'Review'}
        </h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            void handleRecommendMessages();
          }}
          disabled={isRecommending}
        >
          {isRecommending ? 'Recommending' : 'Recommend'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            void handleRefreshMessages();
          }}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing' : 'Refresh'}
        </Button>
      </div>
      <Separator />
      <div className="p-4">
        {/* <ScrollArea className="p-4">
          <ScrollBar orientation="vertical" className="invisible" /> */}
        <DataTable
          data={contribute ? filteredDataTable : dataTable}
          columns={columns}
          onRowClick={handleRowClick}
          selectedRowId={selectedMessage?.id}
        />
        {/* </ScrollArea> */}
      </div>
    </>
  );
}
