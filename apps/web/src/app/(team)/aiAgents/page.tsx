import { Metadata } from 'next';
import AiAgents from './AiAgents';

export const metadata: Metadata = {
  title: 'AI Agents',
};

export default async function Page() {
  return (
    <>
      <AiAgents />
    </>
  );
}
