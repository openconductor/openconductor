'use client';

import { columns } from './columns';
import { DataTable } from '../examples/tasks/components/data-table';
import { UserNav } from '../examples/tasks/components/user-nav';
import { api } from '@/lib/api';

export type ResponseSummary = {
  summary: string;
  bullets: String[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export default function TriageTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();

  console.log('teamData', teamData, teamStatus);

  const {
    data: messages,
    status: messagesStatus,
    refetch,
  } = api.message.all.useQuery(
    { type: 'TRIAGE' },
    {
      enabled: true,
    },
  );

  console.log('messages', messages, messagesStatus);

  if (!messages) return <></>;

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
    <>
      <div className="md:hidden"></div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Triage</h2>
            <p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={dataTable} columns={columns} />
      </div>
    </>
  );
}
