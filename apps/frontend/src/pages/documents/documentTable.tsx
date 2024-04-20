import Link from 'next/link';
import router, { useRouter } from 'next/router';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';

export default function ConductorTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();
  const { data: documents, status: documentsStatus } = api.document.all.useQuery();

  if (teamStatus !== 'success' || documentsStatus !== 'success') {
    return <></>;
  }

  const columns = [
    {
      Header: 'type',
      accessor: 'type',
    },
    {
      Header: 'source',
      accessor: 'source',
    },
    {
      Header: 'content',
      accessor: 'content',
    },
  ];

  const dataTable =
    documents.map((document) => ({
      id: document.id,
      type: document.type,
      source: document.source,
      content: document.content,
    })) ?? [];

  return (
    <div>
      <PageHeading title="Documents" description="All your AI-embedded documents.">
        <Link href="/documents/new">
          <Button variant={ButtonVariant.Primary}>Add documents</Button>
        </Link>
      </PageHeading>
      <Table
        columns={columns}
        data={dataTable}
        onRowClick={async (row) => router.push(`/documents/${String(row.original.id)}`)}
      />
    </div>
  );
}
