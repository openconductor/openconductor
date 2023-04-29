import Block from './blocks/[id]';
import BlockCard from './blocks/blockCard';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import AgentInstructions from './agentInstructions';

export default function AgentPlayground({ agentId }: { agentId: string }) {
  const router = useRouter();
  const { block_id } = router.query;

  const [blockId, setBlockId] = useState<string | undefined>(block_id?.toString());
  const { data: agent, status: agentStatus } = api.agent.byId.useQuery({ id: agentId });
  const { data: blocks, status: blockStatus } = api.block.byAgentId.useQuery({ agentId });

  useEffect(() => {
    setBlockId(block_id?.toString());
  }, [block_id]);

  if (!agentId || agentStatus === 'loading' || blockStatus === 'loading') {
    return <></>;
  }

  if (agentStatus === 'error' || blockStatus === 'error' || !agent) {
    return <div>Error!</div>;
  }

  return (
    <section>
      <ul className={clsx(blockId ? 'max-w-sm' : ' mx-auto max-w-sm', 'flex flex-col gap-y-6 mt-8')}>
        <AgentInstructions agentId={agentId} />
        {blocks?.map((block) => (
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
