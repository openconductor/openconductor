import AgentPlayground from '../agents/[agent_id]/agentPlayground';
import { NextPage } from 'next';
import AgentLayout from '~/components/layouts/agentLayout';
import PageHeading from '~/components/shared/pageHeading';
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
      <PageHeading title="Playground" description="Test your instructions and save them as agents."></PageHeading>
      <AgentPlayground agentId={agent.id} />
    </AgentLayout>
  );
};

export default Playground;
