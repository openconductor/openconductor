import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import WorkflowTable from '~/pages/workflows/workflowTable';

const Workflows: NextPage = () => {
  return (
    <AppLayout>
      <WorkflowTable />
    </AppLayout>
  );
};

export default Workflows;
