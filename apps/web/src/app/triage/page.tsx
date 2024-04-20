import { Metadata } from 'next';
import TriageTable from './TriageTable';

export const metadata: Metadata = {
  title: 'Triage',
  description: 'A task and issue tracker build using Tanstack Table.',
};

export default async function Triage() {
  return (
    <>
      <TriageTable />
    </>
  );
}
