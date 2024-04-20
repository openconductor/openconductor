import { useRouter } from 'next/router';
import AgentLayout from '~/components/layouts/agentLayout';
import AgentHeader from '~/pages/agents/[agent_id]/agentHeader';
import AgentPlayground from '~/pages/agents/[agent_id]/agentPlayground';

const AgentPage: React.FC = () => {
  const router = useRouter();
  const { agent_id } = router.query;

  if (!agent_id) {
    return <></>;
  }

  return (
    <AgentLayout>
      <main>
        <AgentHeader />
        <AgentPlayground agentId={agent_id.toString()} />
      </main>
    </AgentLayout>
  );
};

export default AgentPage;
