'use client';

import { columns } from './columns';
import { DataTable } from './components/data-table';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { MessageType } from '@openconductor/db';
import { useEffect, useState } from 'react';
import { SideDrawer } from '@/components/drawer';
import { Message } from './[messageId]/message';

export type ResponseSummary = {
  summary: string;
  bullets: String[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export default function TriageTable({ type }: { type: MessageType }) {
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

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState('');

  const handleRefreshMessages = async () => {
    await refreshMessages({ teamId: teamData?.id ?? '' });
    refetch();
  };

  const handleRowClick = (row: { original: { id: string } }) => {
    console.log('row', row.original.id);
    setSelectedMessageId(row.original.id);
    setDrawerOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && messages && messages.length > 0) {
        event.preventDefault();
        const currentIndex = messages.findIndex((message) => message.id === selectedMessageId);
        let newIndex = currentIndex;

        if (event.key === 'ArrowUp') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
        } else if (event.key === 'ArrowDown') {
          newIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
        }

        const newSelectedMessageId = messages[newIndex]?.id;
        if (newSelectedMessageId) {
          setSelectedMessageId(newSelectedMessageId);
          setDrawerOpen(true);
        }
      } else if (event.key === 'Escape') {
        setSelectedMessageId('');
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, selectedMessageId]);

  if (teamStatus !== 'success' || messagesStatus !== 'success') {
    return <></>;
  }

  const dataTable =
    messages.map((message) => ({
      id: message.id,
      key: message.key,
      repo: message.source.sourceId,
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
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {type === MessageType.TRIAGE && (
          <>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Good first issues</h2>
                <p className="text-muted-foreground">Ideal for first time contributions.</p>
              </div>
            </div>
            <DataTable
              minimal={true}
              data={filteredDataTable}
              columns={columns}
              onRowClick={handleRowClick}
              selectedRowId={selectedMessageId}
            />
          </>
        )}

        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {type === MessageType.TRIAGE && 'Triage'}
              {type === MessageType.REVIEW && 'Review'}
            </h2>
            <p className="text-muted-foreground">
              Pick {type === MessageType.TRIAGE && 'an issue'} {type === MessageType.REVIEW && 'a PR'} to work on.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={(event) => {
                event.preventDefault();
                void handleRefreshMessages();
              }}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing' : 'Refresh'}
            </Button>
          </div>
        </div>
        <DataTable data={dataTable} columns={columns} onRowClick={handleRowClick} selectedRowId={selectedMessageId} />
        {selectedMessageId && (
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={() => {
              setDrawerOpen(false);
              setSelectedMessageId('');
            }}
            children={<Message messageId={selectedMessageId} />}
          />
        )}
      </div>
    </>
  );
}
