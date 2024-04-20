import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import PluginTable from '~/pages/plugins/pluginTable';

const Plugins: NextPage = () => {
  return (
    <AppLayout>
      <PluginTable />
    </AppLayout>
  );
};

export default Plugins;
