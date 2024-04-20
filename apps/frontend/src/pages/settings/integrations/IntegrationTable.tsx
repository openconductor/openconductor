import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function IntegrationTable() {
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();

  const { data: integrations, status: integrationsStatus, refetch } = api.integration.all.useQuery();
  const { mutateAsync: createIntegration } = api.integration.create.useMutation();
  const { mutate: deleteIntegration } = api.integration.delete.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const router = useRouter();

  const handleCreateIntegration = async () => {
    const integration = await createIntegration({
      type: 'OPENAI',
      teamId: teamData?.id || '',
    });

    await router.push(`/integrations/${integration.id}`);
  };

  if (teamStatus !== 'success' || integrationsStatus !== 'success') {
    return <></>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 ">Integrations</h1>
          <p className="mt-2 text-sm text-neutral-700">All your AI-powered integrations.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={(e) => {
              e.preventDefault();
              void handleCreateIntegration();
            }}
            type="button"
            className="block rounded-md bg-gigas-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            Create integration
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-neutral-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Status
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {integrations.map((integration) => (
                  <tr key={integration.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="font-medium hover:underline">
                          <Link href={`/integrations/${integration.id}`}>{integration.type}</Link>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
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
