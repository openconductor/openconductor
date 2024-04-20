import AgentHeader from './agentHeader';

import { useRouter } from 'next/router';
import AgentLayout from '~/components/layouts/agentLayout';
import AgentPlayground from './agentPlayground';

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
