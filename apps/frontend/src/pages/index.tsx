import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import ConductorTable from '~/pages/conductors/conductorTable';

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <ConductorTable />
    </AppLayout>
  );
};

export default Dashboard;
