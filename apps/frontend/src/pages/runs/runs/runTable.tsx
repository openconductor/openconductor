import { Run } from '@openconductor/db/types';
import Link from 'next/link';
import PageHeading from '~/components/shared/pageHeading';
import { Table } from '~/components/shared/table';
import { api } from '~/utils/api';
import { dayNow } from '~/utils/helpers/day';

export default function RunTable() {
  const { data: runs, status: runsStatus } = api.run.all.useQuery();

  if (runsStatus !== 'success') {
    return <></>;
  }

  const columns = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'agentId',
      accessor: 'agentId',
    },
    {
      Header: 'temporalId',
      accessor: 'temporalId',
    },
    {
      Header: 'status',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeading title="Usage" description="All your AI-powered runs."></PageHeading>
      <Table columns={columns} data={runs} />
    </div>
  );
}
