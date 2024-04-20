import { Metadata } from 'next';
import Sources from './Sources';

export const metadata: Metadata = {
  title: 'Sources',
};

export default async function Page() {
  return (
    <>
      <Sources />
    </>
  );
}
