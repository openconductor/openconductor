import Block from './blocks/[id]';
import BlockCard from './blocks/blockCard';
import WorkflowHeader from './workflowHeader';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import WorkflowLayout from '~/components/layouts/workflowLayout';
import { api } from '~/utils/api';

const WorkflowPage: React.FC = () => {
  const router = useRouter();
  const { workflow_id, block_id } = router.query;
  const [blockId, setBlockId] = useState<string | undefined>(block_id?.toString());
  const { data: workflow, status: workflowStatus } = api.workflow.byId.useQuery({ id: workflow_id as string });

  useEffect(() => {
    setBlockId(block_id?.toString());
  }, [block_id]);

  if (!workflow_id || workflowStatus === 'loading') {
    return <></>;
  }

  if (workflowStatus === 'error' || !workflow) {
    return <div>Error!</div>;
  }

  const instructionBlock = {
    id: 'instruction',
    name: 'Instructions',
    order: 0,
    input: 'input',
    workflowId: workflow.id,
    agentId: '',
    creatorId: '',
    events: [],
  };

  return (
    <WorkflowLayout>
      <main>
        <WorkflowHeader />
        <ul className={clsx(blockId ? 'max-w-sm' : ' mx-auto max-w-sm', 'flex flex-col gap-y-6 mt-8')}>
          <Fragment>
            <BlockCard key="instructions" block={instructionBlock} />
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
