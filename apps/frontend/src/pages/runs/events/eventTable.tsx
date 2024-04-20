import { Event } from '@openconductor/db/types';
import Link from 'next/link';
import { api } from '~/utils/api';

export default function EventTable({ blockId, agentId }: { blockId?: string; agentId?: string }) {
  const { data: events, status: eventsStatus } = api.event.all.useQuery({ blockId, agentId });

  if (eventsStatus !== 'success') {
    return <></>;
  }

  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-neutral-300 dark:divide-neutral-600">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Id
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Output
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Duration
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-600">
                {events.map((event: Event) => (
                  <tr key={event.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium hover:underline">
                        <Link href={`/events/${event.id}`}>{event.id}</Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex px-2 text-xs leading-5">{event.output}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex px-2 text-xs leading-5">
                        {event.endedAt &&
                          `${Math.round(Math.abs(event.endedAt.getTime() - event.startedAt!.getTime()) / 1000)}s`}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex px-2 text-xs leading-5">{event.tokens}</span>
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
