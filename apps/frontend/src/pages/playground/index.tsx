import AgentPlayground from '../agents/[agent_id]/agentPlayground';
import { NextPage } from 'next';
import AgentLayout from '~/components/layouts/agentLayout';
import { api } from '~/utils/api';

const Playground: NextPage = () => {
  const { data: agent, status: agentStatus } = api.agent.playground.useQuery({});
  if (!agent) {
    return <></>;
  }

  if (agentStatus === 'error') {
    return <div>Error!</div>;
  }
  return (
    <AgentLayout>
      <div className="md:flex md:items-center md:justify-between md:space-x-5">
        <div className="flex space-x-5 items-center">
          <div>
            <h1 className="text-2xl font-bold ">Playground</h1>
            <p className="text-sm font-medium text-neutral-500">Test your instructions and save them as agents.</p>
          </div>
        </div>
      </div>
      <AgentPlayground agentId={agent.id} />
    </AgentLayout>
  );
};

export default Playground;
