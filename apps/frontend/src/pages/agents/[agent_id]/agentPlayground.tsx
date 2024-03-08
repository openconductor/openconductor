import AgentInstructions from './agentInstructions';
import Block from './blocks/[id]';
import BlockCard from './blocks/blockCard';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';

export default function AgentPlayground({ agentId, conductor }: { agentId: string, conductor?:boolean }) {
  const router = useRouter();
  const { block_id } = router.query;

  const [blockId, setBlockId] = useState<string | undefined>(block_id?.toString());
  const { data: agent, status: agentStatus } = api.agent.byId.useQuery({ id: agentId });

  const [blocks] = api.useQueries((t) => [t.block.byAgentId({ agentId })]);

  useEffect(() => {
    const refetchBlocks = async () => {
      blocks.refetch();
    };
    console.log('blocks', blocks);
    // if (blocks.status === 'success') {
    const intervalId = setInterval(refetchBlocks, 500); // Poll every 500ms}
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
    // }
  }, [agentId, blocks]);

  useEffect(() => {
    setBlockId(block_id?.toString());
  }, [block_id]);

  if (!agentId || agentStatus === 'loading') {
    return <></>;
  }

  if (agentStatus === 'error' || !agent) {
    return <div>Error!</div>;
  }

  return (
    <section>
      <ul className={clsx(blockId ? 'max-w-sm' : ' mx-auto max-w-sm', 'flex flex-col gap-y-6 mt-8')}>
        <AgentInstructions agentId={agentId} conductor={conductor} />
        {blocks?.data?.map((block) => (
          <div
            key={block.id}
            onClick={(event) => {
              event.preventDefault();
              blockId ? router.push(`/agents/${agentId}`) : router.push(`/agents/${agentId}?block_id=${block.id}`);
            }}
          >
            <Fragment>
              <BlockCard key={block.id} block={block} />
            </Fragment>
          </div>
        ))}
      </ul>
      {blockId && <Block blockId={blockId} />}
    </section>
  );
}
