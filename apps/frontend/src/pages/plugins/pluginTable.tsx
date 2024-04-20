import Plugin from './[id]';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button, { ButtonVariant } from '~/components/shared/button';
import HeaderTitle from '~/components/shared/headerTitle';
import { api } from '~/utils/api';

export default function PluginTable() {
  const router = useRouter();
  const { plugin_id } = router.query;
  const [pluginId, setPluginId] = useState<string | undefined>(plugin_id?.toString());

  const { data: teamData } = api.team.activeTeam.useQuery();
  const { data: integrationData } = api.integration.activeIntegration.useQuery();
  const { data: plugins, status: pluginsStatus } = api.plugin.all.useQuery();

  const { mutateAsync: createPlugin } = api.plugin.create.useMutation();

  const handleCreatePlugin = async () => {
    await createPlugin({
      name: 'My new plugin',
      type: 'TRANSFORM',
      teamId: teamData?.id || '',
      integrationId: integrationData?.id || '',
    });
  };

  useEffect(() => {
    setPluginId(plugin_id?.toString());
  }, [plugin_id]);

  if (pluginsStatus !== 'success') {
    return <></>;
  }

  return (
    <main>
      <HeaderTitle title="Plugins" description="All your AI-powered plugins.">
        <Button
          variant={ButtonVariant.Primary}
          onClick={(e) => {
            e.preventDefault();
            void handleCreatePlugin();
          }}
        >
          Create plugin
        </Button>
      </HeaderTitle>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-neutral-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Integration
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ">
                    Usage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {plugins.map((plugin) => (
                  <tr key={plugin.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium hover:underline">
                        <Link href={`/plugins?plugin_id=${plugin.id}`}>{plugin.name}</Link>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="">{plugin.type}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="">{plugin.integration.type}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <div className="">{plugin.blocks.length} blocks</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {pluginId && <Plugin pluginId={pluginId} />}
    </main>
  );
}
