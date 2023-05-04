import { useRouter } from 'next/router';
import AgentLayout from '~/components/layouts/agentLayout';
import AgentHeader from '~/pages/agents/[agent_id]/agentHeader';
import AgentPlayground from '~/pages/agents/[agent_id]/agentPlayground';

const ConductorPage: React.FC = () => {
  const router = useRouter();
  const { conductor_id } = router.query;

  if (!conductor_id) {
    return <></>;
  }

  return (
    <AgentLayout>
      <main>
        <AgentHeader />
        <AgentPlayground agentId={conductor_id.toString()} />
      </main>
    </AgentLayout>
  );
};

export default ConductorPage;
