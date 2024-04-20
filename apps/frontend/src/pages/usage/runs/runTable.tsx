import { Run } from '@openconductor/db/types';
import Link from 'next/link';
import { api } from '~/utils/api';
import { dayNow } from '~/utils/helpers/day';

export default function RunTable() {
  const { data: runs, status: runsStatus } = api.run.all.useQuery();

  if (runsStatus !== 'success') {
    return <></>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Runs</h1>
          <p className="mt-2 text-sm text-neutral-700">All your AI-powered runs.</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-neutral-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Id
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Scheduled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {runs.map((run: Run) => (
                  <tr key={run.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium hover:underline">
                        <Link href={`/runs/${run.id}`}>{run.id}</Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {run.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex px-2 text-xs leading-5">{dayNow(run.startedAt!)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
