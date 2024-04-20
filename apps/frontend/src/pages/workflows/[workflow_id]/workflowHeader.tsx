import { useRouter } from 'next/router';
import { useState } from 'react';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

export default function WorkflowHeader() {
  const router = useRouter();
  const utils = api.useContext();
  const { workflow_id } = router.query;

  const { data: workflow } = api.workflow.byId.useQuery({ id: workflow_id as string });

  const [nameInput, setNameInput] = useState<string | undefined>(workflow?.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { mutate } = api.workflow.update.useMutation({
    async onSuccess() {
      await utils.workflow.byId.invalidate();
    },
  });

  if (!workflow) return <></>;

  const lastRun = workflow.runs[workflow.runs.length - 1];

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex space-x-5 items-center">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-2xl font-bold lg:w-[25rem]"
            />
          ) : (
            <h1 className="text-2xl font-bold ">{workflow.name}</h1>
          )}
          <p className="text-sm font-medium text-neutral-500">
            <span className="">{workflow.blocks.length}</span> blocks in workflow. Last run:{' '}
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
              mutate({ id: workflow.id, name: nameInput! });
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
