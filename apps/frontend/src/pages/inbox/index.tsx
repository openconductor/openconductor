import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import MessageTable from '~/pages/inbox/messageTable';

const Inbox: NextPage = () => {
  return (
    <AppLayout>
      <MessageTable />
    </AppLayout>
  );
};

export default Inbox;
