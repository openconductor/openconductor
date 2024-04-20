import { Block, Run, Workflow } from '@openconductor/db';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { api } from '~/utils/api';

export default function WorkflowHeader({
  workflow,
}: {
  workflow: Workflow & {
    blocks: Block[];
    runs: Run[];
  };
}) {
  const utils = api.useContext();
  const [nameInput, setNameInput] = useState<string>(workflow.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { mutate } = api.workflow.update.useMutation({
    async onSuccess() {
      await utils.workflow.byId.invalidate();
    },
  });

  const lastRun = workflow.runs[workflow.runs.length - 1];

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex space-x-5 items-center">
        <div className="pt-1.5">
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
          <button
            onClick={() => {
              mutate({ id: workflow.id, name: nameInput });
              setIsEditing(false);
            }}
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-gigas-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
            }}
            type="button"
            className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
          >
            <Pencil1Icon className="mr-2 h-5 w-5 text-neutral-400" />
            Edit name
          </button>
        )}
      </div>
    </div>
  );
}
