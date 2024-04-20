import EventTable from './events/eventTable';
import RunTable from './runs/runTable';
import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';

const Usage: NextPage = () => {
  return (
    <AppLayout>
      <RunTable />
      <EventTable />
    </AppLayout>
  );
};

export default Usage;
