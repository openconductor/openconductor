import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';
import { SideDrawer } from '~/components/shared/drawer';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { MessageType } from '@openconductor/db';
import Label from '~/components/shared/label';
import clsx from 'clsx';

export function Message({ messageId }: { messageId: string }) {
  const {
    data: message,
    status: messageStatus,
    refetch,
  } = api.message.byId.useQuery(
    {
      id: messageId,
    },
    {
      enabled: true,
    },
  );

  return (
    messageStatus === 'success' && (
      <div className="p-5">
        <div>
          <Link href={message?.url!} target="_blank">
            {message?.key}
          </Link>
          - {message?.state}
        </div>
        <div className="pre">
          <Markdown className="text-base space-y-4">{message?.body}</Markdown>
        </div>
        ---
        {message?.children.map((comment) => (
          <div className="pre" key={comment.id}>
            <Markdown className="text-base space-y-4">{comment?.body}</Markdown>
            ---
          </div>
        ))}
      </div>
    )
  );
}

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
      accessor: 'title',
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
    })) ?? [];

  return (
    <div>
      <PageHeading title="Messages" description="All your AI-powered messages.">
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
