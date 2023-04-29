import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

export default function AgentInstructions({ agentId }: { agentId: string }) {
  const utils = api.useContext();
  const { data: agent, status: agentStatus } = api.agent.byId.useQuery({ id: agentId });
  const [agentPrompt, setAgentPrompt] = useState<string | undefined>(agent?.prompt);
  const [agentInput, setAgentInput] = useState<string | undefined>(JSON.stringify(agent?.input));

  const { mutate } = api.agent.update.useMutation({
    async onSuccess() {
      await utils.agent.byId.invalidate({ id: agentId as string });
      toast.success('Agent saved');
    },
  });

  const { mutate: createRun } = api.run.create.useMutation({
    async onSuccess() {
      toast.success('Triggered run');
      await utils.block.byAgentId.invalidate({ agentId });
    },
  });

  if (!agentId || agentStatus === 'loading') {
    return <></>;
  }

  if (agentStatus === 'error' || !agent) {
    return <div>Error!</div>;
  }

  return (
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
          {!agent.playground && (
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
          )}
          <Button
            variant={ButtonVariant.Primary}
            className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
            onClick={(e) => {
              e.preventDefault();
              mutate({ id: agent.id, prompt: agentPrompt!, input: JSON.parse(agentInput!) });
              createRun({
                agentId: agent.id,
                prompt: agentPrompt!,
                input: JSON.parse(agentInput!),
              });
            }}
          >
            {agent.playground ? 'Test' : 'Run'}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
