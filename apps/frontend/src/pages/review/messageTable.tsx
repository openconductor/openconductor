import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';
import { SideDrawer } from '~/components/shared/drawer';
import { MessageType } from '@openconductor/db';
import Label from '~/components/shared/label';
import clsx from 'clsx';
import { Message, ResponseSummary } from './message';
import { SparklesIcon } from '@heroicons/react/20/solid';

export default function MessageTable({ type }: { type: MessageType }) {
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

  const columns = [
    {
      Header: 'Id',
      accessor: 'key',
      Cell: ({ row }: { row: { original: { id: string; key: string } } }) => (
        <div
          className={clsx(
            row.original.id === selectedMessageId ? 'border-l-2 border-indigo-500 pl-1' : 'pl-1.5',
            '-ml-2',
          )}
        >
          {row.original.key}
        </div>
      ),
    },
    {
      Header: 'Author',
      accessor: 'author.handle',
      Cell: ({ row }: { row: { original: { author: { imageUrl: string; handle: string } } } }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={row.original.author.imageUrl}
            alt={row.original.author.handle}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full mr-2"
          />
          {row.original.author.handle}
        </div>
      ),
    },
    {
      Header: 'Title',
      accessor: 'summary',
      Cell: ({ row }: { row: { original: { summary: string; title: string } } }) => (
        <div>
          <p>{row.original.title}</p>
          <p className="flex text-xs text-blue-600 items-center">
            <SparklesIcon className="h-2 w-2 mr-1" aria-hidden="true" /> {row.original.summary}
          </p>
        </div>
      ),
    },
    {
      Header: 'Labels',
      accessor: 'labels',
      Cell: ({ value }: { value: { name: string; color: string }[] }) => (
        <div className="flex items-center gap-2">
          {value.map((label, index) => (
            <div key={index}>
              <Label name={label.name} color={label.color} />
            </div>
          ))}
        </div>
      ),
    },
    {
      Header: 'Source',
      accessor: 'source',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: { row: { original: { priority: string; status: string } } }) => (
        <div>
          <p>{row.original.status}</p>
          <p className="flex text-xs text-blue-600 items-center">
            <SparklesIcon className="h-2 w-2 mr-1" aria-hidden="true" /> {row.original.priority}
          </p>
        </div>
      ),
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
    },
  ];

  const dataTable =
    messages.map((message) => ({
      id: message.id,
      key: message.key,
      source: message.source,
      title: message.title,
      body: message.body,
      url: message.url,
      createdAt: message.createdAt.toLocaleDateString(),
      author: {
        ...message.author,
      },
      status: message.state,
      labels: message.labels,
      summary: (message.aiItems?.[0]?.response as unknown as ResponseSummary)?.summary,
      priority: (message.aiItems?.[0]?.response as unknown as ResponseSummary)?.priority,
    })) ?? [];

  return (
    <div>
      <PageHeading
        title={type === MessageType.TRIAGE ? 'Triage' : 'Review'}
        description="All your AI-powered messages."
      >
        <Button
          variant={ButtonVariant.Secondary}
          onClick={(event) => {
            event.preventDefault();
            void handleRefreshMessages();
          }}
          loading={isRefreshing}
        >
          {isRefreshing ? 'Refreshing' : 'Refresh'}
        </Button>
      </PageHeading>
      <Table columns={columns} data={dataTable} onRowClick={handleRowClick} />
      {selectedMessageId && (
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          children={<Message messageId={selectedMessageId} />}
        />
      )}
    </div>
  );
}
