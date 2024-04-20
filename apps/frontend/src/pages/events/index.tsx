import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SidebarLayout from '~/components/layouts/sidebarLayout';
import EventTable from '~/pages/events/eventTable';

const Events: NextPage = () => {
  const { data: userData, status: userStatus } = useSession();
  const router = useRouter();

  if (userStatus === 'loading') {
    return <></>;
  }

  if (userStatus === 'unauthenticated' || !userData) {
    void router.push('/login');
    return null;
  }

  return (
    <div className="h-screen">
      <SidebarLayout>
        <EventTable />
      </SidebarLayout>
    </div>
  );
};

export default Events;
