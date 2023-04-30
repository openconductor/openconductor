import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import ConductorTable from '~/pages/conductors/conductorTable';

const Conductors: NextPage = () => {
  return (
    <AppLayout>
      <ConductorTable />
    </AppLayout>
  );
};

export default Conductors;
