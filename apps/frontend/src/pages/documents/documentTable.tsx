import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function ConductorTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();
  const { data: documents, status: documentsStatus } = api.document.all.useQuery();

  if (teamStatus !== 'success' || documentsStatus !== 'success') {
    return <></>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Documents</h1>
          <p className="mt-2 text-sm  ">All your AI-embedded documents.</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-neutral-300 dark:divide-neutral-600">
              <thead>
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Content
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Type
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Source
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Embedding
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium hover:underline truncate">
                        <Link href={`/documents/${document.id}`}>{document.content}</Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <div className="">{document.type}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{document.source}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      {
                        //@ts-ignore
                        document.embedding.length
                      }
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        TBD
                      </span>
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
