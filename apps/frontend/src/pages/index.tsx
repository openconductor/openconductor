import { MessageType } from '@openconductor/db';
import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import MessageTable from '~/pages/review/messageTable';

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <MessageTable type={MessageType.TRIAGE} />
    </AppLayout>
  );
};

export default Dashboard;
