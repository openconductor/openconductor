import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import AgentTable from '~/pages/agents/agentTable';

const Agents: NextPage = () => {
  return (
    <AppLayout>
      <AgentTable />
    </AppLayout>
  );
};

export default Agents;
