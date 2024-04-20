import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';

export default function MessageTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();

  const {
    data: messages,
    status: messagesStatus,
    refetch,
  } = api.message.all.useQuery({
    enabled: true,
  });
  const { mutateAsync: refreshMessages, isLoading: isRefreshing } = api.message.refresh.useMutation();

  const handleRefreshMessages = async () => {
    await refreshMessages({ teamId: teamData?.id ?? '' });
    refetch();
  };

  if (teamStatus !== 'success' || messagesStatus !== 'success') {
    return <></>;
  }

  const columns = [
    {
      Header: 'Id',
      accessor: 'key',
    },
    {
      Header: 'Title',
      accessor: 'title',
    },
    {
      Header: 'Source',
      accessor: 'source',
    },
    {
      Header: 'Url',
      accessor: 'url',
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
    },
  ];

  const dataTable =
    messages.map((message) => ({
      key: message.key,
      source: message.source,
      title: message.title,
      body: message.body,
      url: message.url,
      createdAt: message.createdAt.toLocaleDateString(),
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
      <Table columns={columns} data={dataTable} onRowClick={async (row) => window.open(row.original.url, '_ blank')} />
    </div>
  );
}
