import { Metadata } from 'next';
import { MessageType } from '@openconductor/db';
import TriageTable from '../triage/TriageTable';

export const metadata: Metadata = {
  title: 'Review',
  description: 'Pick a PR to work on.',
};

export default async function Review() {
  return (
    <>
      <TriageTable type={MessageType.REVIEW} />
    </>
  );
}
