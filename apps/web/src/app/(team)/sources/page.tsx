import { Metadata } from 'next';
import Sources from './Sources';

export const metadata: Metadata = {
  title: 'Sources',
  description: 'Add sources like repositories.',
};

export default async function Page() {
  return (
    <>
      <Sources />
    </>
  );
}
