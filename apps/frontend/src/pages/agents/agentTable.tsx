import Agent from './[id]';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button, { ButtonVariant } from '~/components/shared/button';
import HeaderTitle from '~/components/shared/headerTitle';
import { api } from '~/utils/api';

export default function AgentTable() {
  const router = useRouter();
  const { agent_id } = router.query;
  const [agentId, setAgentId] = useState<string | undefined>(agent_id?.toString());

  const { data: teamData } = api.team.activeTeam.useQuery();
  const { data: integrationData } = api.integration.activeIntegration.useQuery();
  const { data: agents, status: agentsStatus } = api.agent.all.useQuery();

  const { mutateAsync: createAgent } = api.agent.create.useMutation();

  const handleCreateAgent = async () => {
    await createAgent({
      name: 'My new agent',
      type: 'TRANSFORM',
      teamId: teamData?.id || '',
      integrationId: integrationData?.id || '',
    });
  };

  useEffect(() => {
    setAgentId(agent_id?.toString());
  }, [agent_id]);

  if (agentsStatus !== 'success') {
    return <></>;
  }

  return (
    <main>
      <HeaderTitle title="Agents" description="All your AI-powered agents.">
        <Button
          variant={ButtonVariant.Primary}
          onClick={(e) => {
            e.preventDefault();
            void handleCreateAgent();
          }}
        >
          Create agent
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
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium hover:underline">
                        <Link href={`/agents?agent_id=${agent.id}`}>{agent.name}</Link>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="">{agent.type}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-neutral-500">
                      <span className="">{agent.integration.type}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                      <div className="">{agent.blocks.length} blocks</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {agentId && <Agent agentId={agentId} />}
    </main>
  );
}
