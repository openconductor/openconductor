import { useRouter } from 'next/router';
import { useState } from 'react';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

export default function AgentHeader() {
  const router = useRouter();
  const utils = api.useContext();
  const { agent_id } = router.query;

  const { data: agent } = api.agent.byId.useQuery({ id: agent_id as string });

  const [nameInput, setNameInput] = useState<string | undefined>(agent?.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { mutate } = api.agent.update.useMutation({
    async onSuccess() {
      await utils.agent.byId.invalidate();
    },
  });

  if (!agent) return <></>;

  const lastRun = agent.runs[agent.runs.length - 1];

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex space-x-5 items-center">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-2xl font-bold lg:w-[25rem] dark:bg-neutral-900 rounded-lg"
            />
          ) : (
            <h1 className="text-2xl font-bold ">{agent.name}</h1>
          )}
          <p className="text-sm font-medium text-neutral-500">
            <span className="">{agent.blocks.length}</span> blocks in agent. Last run:{' '}
            <span className="">
              {lastRun && lastRun.startedAt ? new Date(lastRun?.startedAt).toLocaleString() : 'never'}
            </span>
            .
          </p>
        </div>
      </div>
      <div className="mt-3 flex sm:ml-4 sm:mt-0">
        {isEditing ? (
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              mutate({ id: agent.id, name: nameInput! });
              setIsEditing(false);
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
