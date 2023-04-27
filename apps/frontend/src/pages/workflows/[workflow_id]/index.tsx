import Block from './blocks/[id]';
import BlockCard from './blocks/blockCard';
import WorkflowHeader from './workflowHeader';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import WorkflowLayout from '~/components/layouts/workflowLayout';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

const WorkflowPage: React.FC = () => {
  const router = useRouter();
  const { workflow_id, block_id } = router.query;
  const utils = api.useContext();
  const [blockId, setBlockId] = useState<string | undefined>(block_id?.toString());
  const { data: workflow, status: workflowStatus } = api.workflow.byId.useQuery({ id: workflow_id as string });
  const [workflowPrompt, setWorkflowPrompt] = useState<string | undefined>(workflow?.prompt);
  const [workflowInput, setWorkflowInput] = useState<string | undefined>(workflow?.input);

  const { mutate } = api.workflow.update.useMutation({
    async onSuccess() {
      await utils.workflow.byId.invalidate();
      toast.success('Workflow saved');
    },
  });

  const { mutate: createRun } = api.run.create.useMutation({
    async onSuccess() {
      toast.success('Triggered run');
      await utils.workflow.byId.invalidate();
    },
  });

  useEffect(() => {
    setBlockId(block_id?.toString());
  }, [block_id]);

  if (!workflow_id || workflowStatus === 'loading') {
    return <></>;
  }

  if (workflowStatus === 'error' || !workflow) {
    return <div>Error!</div>;
  }

  return (
    <WorkflowLayout>
      <main>
        <WorkflowHeader />
        <ul className={clsx(blockId ? 'max-w-sm' : ' mx-auto max-w-sm', 'flex flex-col gap-y-6 mt-8')}>
          <Fragment>
            Instructions:
            <textarea
              rows={4}
              value={workflowPrompt}
              onChange={(e) => setWorkflowPrompt(e.target.value)}
              className="lg:w-[25rem] dark:bg-black"
            />
            Input parameters
            <textarea
              rows={4}
              value={workflowInput}
              onChange={(e) => setWorkflowInput(e.target.value)}
              className="lg:w-[25rem] dark:bg-black"
            />
          </Fragment>
          <Fragment>
            <div className="">
              <Button
                variant={ButtonVariant.Secondary}
                className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                onClick={(e) => {
                  e.preventDefault();
                  mutate({ id: workflow.id, prompt: workflowPrompt!, input: JSON.parse(workflowInput!) });
                }}
              >
                Save
              </Button>
              <Button
                variant={ButtonVariant.Primary}
                className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                onClick={(e) => {
                  e.preventDefault();
                  mutate({ id: workflow.id, prompt: workflowPrompt!, input: JSON.parse(workflowInput!) });
                  createRun({ workflowId: workflow.id, prompt: workflowPrompt!, input: JSON.parse(workflowInput!) });
                }}
              >
                Run
              </Button>
            </div>
          </Fragment>
          {workflow?.blocks?.map((block) => (
            <div
              key={block.id}
              onClick={(event) => {
                event.preventDefault();
                blockId
                  ? router.push(`/workflows/${workflow_id}`)
                  : router.push(`/workflows/${workflow_id}?block_id=${block.id}`);
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
    </WorkflowLayout>
  );
};

export default WorkflowPage;
