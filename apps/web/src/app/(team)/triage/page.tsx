import { Metadata } from 'next';
import TriageTable from './TriageTable';
import { MessageType } from '@openconductor/db';

export const metadata: Metadata = {
  title: 'Triage',
  description: 'Pick an issue to work on.',
};

export default async function Triage() {
  return <TriageTable type={MessageType.TRIAGE} />;
}
