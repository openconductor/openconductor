import IntegrationTable from './integrations/IntegrationTable';
import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';

const Settings: NextPage = () => {
  return (
    <AppLayout>
      <IntegrationTable />
    </AppLayout>
  );
};

export default Settings;
