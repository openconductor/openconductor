import BlockCard from './blockCard';
import WorkflowHeader from './workflowHeader';
import WorkflowLayout from './workflowLayout';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';

const WorkflowPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [logsHiddenBlocks, setLogsHiddenBlocks] = useState<boolean[]>([]);

  const { data: workflow, status: workflowStatus, refetch } = api.workflow.byId.useQuery({ id: id as string });
  const { data: agentData } = api.agent.activeAgent.useQuery();

  const { mutate: createBlock } = api.block.create.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  useEffect(() => {
    // Set logsHiddenBlocks to the correct length of blocks
    if (workflow?.blocks) {
      setLogsHiddenBlocks(Array(workflow.blocks.length).fill(true));
    }
  }, [workflow?.blocks]);

  if (!id || workflowStatus === 'loading') {
    return <></>;
  }

  if (workflowStatus === 'error' || !workflow) {
    return <div>Error!</div>;
  }

  return (
    <WorkflowLayout
      workflow={workflow}
      showAllLogs={() => {
        setLogsHiddenBlocks((prev) => {
          const newLogsHiddenBlocks = [...prev];
          newLogsHiddenBlocks.forEach((_, i) => {
            newLogsHiddenBlocks[i] = false;
          });
          return newLogsHiddenBlocks;
        });
      }}
    >
      <div className="pb-12">
        <WorkflowHeader workflow={workflow} />
      </div>
      <div>
        {/* Buttons for expanding and collapsing all logs */}
        <div className="flex justify-end gap-x-1">
          <button
            type="button"
            onClick={() => {
              setLogsHiddenBlocks(Array(workflow.blocks.length).fill(false));
            }}
            className="rounded-full border border-gigas-600 py-1 px-1.5 text-gigas-600 shadow-sm hover:bg-gigas-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600 text-xs"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => {
              setLogsHiddenBlocks(Array(workflow.blocks.length).fill(true));
            }}
            className="rounded-full border border-gigas-600 py-1 px-1.5 text-gigas-600 shadow-sm hover:bg-gigas-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600 text-xs"
          >
            Collapse all
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-y-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              createBlock({
                workflowId: workflow.id,
                agentId: agentData!.id,
                prevOrder: 0,
              });
              toast.success('Block created');
            }}
            className="rounded-full border border-gigas-600 p-1.5 text-gigas-600 shadow-sm hover:bg-gigas-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {workflow?.blocks?.map((block, index) => (
          <Fragment key={block.id}>
            <BlockCard
              key={block.id}
              block={block}
              logsHidden={logsHiddenBlocks.length ? (logsHiddenBlocks[index] as boolean) : true}
              setLogsHidden={(hidden: boolean) => {
                const newLogsHiddenBlocks = [...logsHiddenBlocks];
                newLogsHiddenBlocks[index] = hidden;
                setLogsHiddenBlocks(newLogsHiddenBlocks);
              }}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  createBlock({
                    workflowId: workflow.id,
                    agentId: agentData!.id,
                    prevOrder: block.order,
                  });
                  toast.success('Block created');
                }}
                className="rounded-full border border-gigas-600 p-1.5 text-gigas-600 shadow-sm hover:bg-gigas-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </Fragment>
        ))}
      </ul>
    </WorkflowLayout>
  );
};

export default WorkflowPage;
