import Link from 'next/link';
import { useRouter } from 'next/router';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';

export default function ConductorTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();
  const { data: conductors, status: agentsStatus, refetch } = api.agent.all.useQuery({ conductor: true });
  const { mutateAsync: createAgent } = api.agent.create.useMutation();
  const { mutate: deleteAgent } = api.agent.delete.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const router = useRouter();

  const handleCreateConductor = async () => {
    const agent = await createAgent({
      name: 'My new conductor',
      conductor: true,
      teamId: teamData!.id,
    });

    await router.push(`/conductors/${agent.id}`);
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
    conductors.map((conductor) => ({
      id: conductor.id,
      name: conductor.name,
      prompt: conductor.prompt,
      blocks: conductor.blocks.length,
      runs: conductor.runs.length,
    })) ?? [];

  console.log('conductors', conductors);
  return (
    <div>
      <PageHeading title="Conductors" description="All your AI-powered conductors.">
        <Button
          variant={ButtonVariant.Primary}
          onClick={(event) => {
            event.preventDefault();
            void handleCreateConductor();
          }}
        >
          Create conductor
        </Button>
      </PageHeading>
      <Table
        columns={columns}
        data={dataTable}
        onRowClick={async (row) => router.push(`/conductors/${String(row.original.id)}`)}
      />
    </div>
  );
}
