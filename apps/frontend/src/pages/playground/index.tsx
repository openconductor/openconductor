import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import AgentPlayground from '../agents/[agent_id]/agentPlayground';
import { api } from '~/utils/api';

const Playground: NextPage = () => {
  const { data: agent, status: agentStatus } = api.agent.playground.useQuery({});
  if (!agent || agentStatus === 'loading') {
    return <></>;
  }

  if (agentStatus === 'error') {
    return <div>Error!</div>;
  }
  return (
    <AppLayout>
      <AgentPlayground agentId={agent.id} />
    </AppLayout>
  );
};

export default Playground;
