import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

export default function WorkflowHeader() {
  const router = useRouter();
  const utils = api.useContext();
  const { workflow_id } = router.query;

  const { data: workflow, refetch } = api.workflow.byId.useQuery({ id: workflow_id as string });
  const { data: agentData } = api.agent.activeAgent.useQuery();

  const [nameInput, setNameInput] = useState<string | undefined>(workflow?.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { mutate: createBlock } = api.block.create.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const { mutate } = api.workflow.update.useMutation({
    async onSuccess() {
      await utils.workflow.byId.invalidate();
    },
  });

  const { mutate: createRun } = api.run.create.useMutation({
    async onSuccess() {
      toast.success('Triggered test successfully!');
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
        <div className="flex justify-center">
          <Button
            variant={ButtonVariant.Tertiary}
            onClick={() => {
              createBlock({
                workflowId: workflow.id,
                agentId: agentData!.id,
                prevOrder: 0,
              });
              toast.success('Block created');
            }}
          >
            + Add block
          </Button>
        </div>
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
        <Button
          variant={ButtonVariant.Primary}
          className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
          onClick={(e) => {
            e.preventDefault();
            toast('Running workflow...');
            createRun({ workflowId: workflow.id, input: workflow.name });
          }}
        >
          Run
        </Button>
      </div>
    </div>
  );
}
