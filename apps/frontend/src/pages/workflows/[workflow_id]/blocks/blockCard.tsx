import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Agent, Block, Event } from '@openconductor/db/types';
import ReactMarkdown from 'react-markdown';
import { api } from '~/utils/api';

export default function BlockCard({
  block,
}: {
  block: Block & {
    agent: Agent | null;
    events: Event[];
  };
}) {
  const utils = api.useContext();

  const { mutate: moveUp } = api.block.moveUp.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
  const { mutate: moveDown } = api.block.moveDown.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });

  console.log('block', block);

  const lastEvent = block.events[block.events.length - 1];

  return (
    <div className="hover:shadow-lg rounded-xl border-2 border-neutral-200 hover:border-indigo-500 bg-white cursor-pointer">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex space-x-3">
          <div className="min-w-0 flex-1 justify-center py-2">
            <p className="font-semibold">{block.name}</p>
          </div>
          <div className="flex flex-shrink-0 self-center">
            <span className="isolate inline-flex rounded-md shadow-sm">
              {block.order > 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveUp(block.id);
                  }}
                  className="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
                >
                  <span className="sr-only">Move up</span>
                  <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  moveDown(block.id);
                }}
                className="relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
              >
                <span className="sr-only">Move down</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
        <div className="py-4">
          {block.agent?.name}
          <ReactMarkdown className="text-neutral-600">{JSON.stringify(block.input) || 'No prompt'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
