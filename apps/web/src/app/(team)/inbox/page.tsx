import { Metadata } from 'next';
import { Inbox } from './Inbox';

export const metadata: Metadata = {
  title: 'Inbox',
  description: 'OpenConductor inbox',
};

export default function InboxPage() {
  return (
    <>
      <Inbox />
    </>
  );
}
