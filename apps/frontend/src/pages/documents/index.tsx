import { NextPage } from 'next';
import AppLayout from '~/components/layouts/appLayout';
import DocumentTable from '~/pages/documents/documentTable';

const Documents: NextPage = () => {
  return (
    <AppLayout>
      <DocumentTable />
    </AppLayout>
  );
};

export default Documents;
