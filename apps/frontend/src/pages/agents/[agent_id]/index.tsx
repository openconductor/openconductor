import Block from './blocks/[id]';
import { Agent, Block as BlockDb } from '@openconductor/db/types';
import BlockCard from './blocks/blockCard';
import AgentHeader from './agentHeader';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AgentLayout from '~/components/layouts/agentLayout';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

const AgentPage: React.FC = () => {
  const router = useRouter();
  const { agent_id, block_id } = router.query;
  const utils = api.useContext();
  const [blockId, setBlockId] = useState<string | undefined>(block_id?.toString());
  const { data: agent, status: agentStatus } = api.agent.byId.useQuery({ id: agent_id as string });
  const [agentPrompt, setAgentPrompt] = useState<string | undefined>(agent?.prompt);
  const [agentInput, setAgentInput] = useState<string | undefined>(JSON.stringify(agent?.input));

  const { data: blocks, status: blockStatus } = api.block.byAgentId.useQuery({ agentId: agent_id as string });

  const { mutate } = api.agent.update.useMutation({
    async onSuccess() {
      await utils.agent.byId.invalidate({ id: agent_id as string });
      toast.success('Agent saved');
    },
  });

  const { mutate: createRun } = api.run.create.useMutation({
    async onSuccess() {
      toast.success('Triggered run');
      await utils.block.byAgentId.invalidate({ agentId: agent_id as string });
    },
  });

  useEffect(() => {
    setBlockId(block_id?.toString());
  }, [block_id]);

  if (!agent_id || agentStatus === 'loading' || blockStatus === 'loading') {
    return <></>;
  }

  if (agentStatus === 'error' || blockStatus === 'error' || !agent) {
    return <div>Error!</div>;
  }

  return (
    <AgentLayout>
      <main>
        <AgentHeader />
        <ul className={clsx(blockId ? 'max-w-sm' : ' mx-auto max-w-sm', 'flex flex-col gap-y-6 mt-8')}>
          <Fragment>
            <div className="shadow-lg rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 space-y-2">
              <div className="space-y-2">
                <label className="text-neutral-500 text-sm">Instructions</label>
                <textarea
                  rows={4}
                  value={agentPrompt ?? agent.prompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  className="lg:w-full bg-neutral-100 dark:bg-black/30 border-none rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-neutral-500 text-sm">Input parameters</label>
                <textarea
                  rows={4}
                  value={agentInput ?? JSON.stringify(agent.input)}
                  onChange={(e) => setAgentInput(e.target.value)}
                  className="lg:w-full bg-neutral-100 dark:bg-black/30 border-none rounded-lg"
                />
              </div>
              <div className="">
                <Button
                  variant={ButtonVariant.Secondary}
                  className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                  onClick={(e) => {
                    e.preventDefault();
                    mutate({ id: agent.id, prompt: agentPrompt!, input: JSON.parse(agentInput!) });
                  }}
                >
                  Save
                </Button>
                <Button
                  variant={ButtonVariant.Primary}
                  className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                  onClick={(e) => {
                    e.preventDefault();
                    mutate({ id: agent.id, prompt: agentPrompt!, input: JSON.parse(agentInput!) });
                    createRun({ agentId: agent.id, prompt: agentPrompt!, input: JSON.parse(agentInput!) });
                  }}
                >
                  Run
                </Button>
              </div>
            </div>
          </Fragment>
          {blocks?.map((block) => (
            <div
              key={block.id}
              onClick={(event) => {
                event.preventDefault();
                blockId ? router.push(`/agents/${agent_id}`) : router.push(`/agents/${agent_id}?block_id=${block.id}`);
              }}
            >
              <Fragment>
                <BlockCard key={block.id} block={block} />
              </Fragment>
            </div>
          ))}
        </ul>
        {blockId && <Block blockId={blockId} />}
      </main>
    </AgentLayout>
  );
};

export default AgentPage;
