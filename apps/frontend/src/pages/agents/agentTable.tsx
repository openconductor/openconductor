import Link from 'next/link';
import { useRouter } from 'next/router';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';

export default function AgentTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();
  const { data: agents, status: agentsStatus, refetch } = api.agent.all.useQuery({});
  const { mutateAsync: createAgent } = api.agent.create.useMutation();
  const { mutate: deleteAgent } = api.agent.delete.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const router = useRouter();

  const handleCreateAgent = async () => {
    const agent = await createAgent({
      name: 'My new agent',
      teamId: teamData?.id || '',
    });

    await router.push(`/agents/${agent.id}`);
  };

  if (teamStatus !== 'success' || agentsStatus !== 'success') {
    return <></>;
  }

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Instructions',
      accessor: 'prompt',
    },
    {
      Header: 'Blocks',
      accessor: 'blocks',
    },
    {
      Header: 'Runs',
      accessor: 'runs',
    },
  ];

  const dataTable =
    agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      prompt: agent.prompt,
      blocks: agent.blocks.length,
      runs: agent.runs.length,
    })) ?? [];

  return (
    <div>
      <PageHeading title="Agents" description="All your AI-powered agents.">
        <Button
          variant={ButtonVariant.Primary}
          onClick={(event) => {
            event.preventDefault();
            void handleCreateAgent();
          }}
        >
          Create agent
        </Button>
      </PageHeading>
      <Table
        columns={columns}
        data={dataTable}
        onRowClick={async (row) => router.push(`/agents/${String(row.original.id)}`)}
      />
    </div>
  );
}
