import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import MessageTable from '~/pages/inbox/messageTable';

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <MessageTable />
    </AppLayout>
  );
};

export default Dashboard;
