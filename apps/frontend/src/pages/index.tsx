import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import AgentTable from '~/pages/agents/agentTable';

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <AgentTable />
    </AppLayout>
  );
};

export default Dashboard;
