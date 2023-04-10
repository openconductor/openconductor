import SelectAgents from '../agents/selectAgents';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Block, Event } from '@prisma/client';
import { CheckIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { api } from '~/utils/api';

export default function BlockCard({
  block,
  logsHidden,
  setLogsHidden,
}: {
  block: Block & {
    events: Event[];
  };
  logsHidden: boolean;
  setLogsHidden: (hidden: boolean) => void;
}) {
  const utils = api.useContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>(JSON.stringify(block.input) || '');

  const { mutate: deleteBlock } = api.block.delete.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
  const { mutate: updateBlock } = api.block.update.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
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

  const lastEvent = block.events[block.events.length - 1];

  return (
    <div className="shadow-md rounded-lg border border-stone-50">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex space-x-3">
          <div className="min-w-0 flex-1"></div>
          <div className="flex flex-shrink-0 self-center">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => moveUp(block.id)}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
              >
                <span className="sr-only">Move up</span>
                <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(block.id)}
                className="relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
              >
                <span className="sr-only">Move down</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    updateBlock({
                      blockId: block.id,
                      agentId: 'clga2kt57000cqhz4vml496v6',
                      input: prompt,
                    });
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
              >
                <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
                {isEditing ? (
                  <CheckIcon className="h-5 w-5 text-green-700" aria-hidden="true" />
                ) : (
                  <Pencil1Icon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: Add some kind of warning message here
                  deleteBlock(block.id);
                  toast.success('Block deleted');
                }}
                className="relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-10"
              >
                <span className="sr-only">Delete</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
        <div className="py-4">
          {isEditing ? (
            <>
              <SelectAgents />
              <textarea
                className="w-full border border-neutral-300 rounded-md shadow-sm focus:ring-gigas-500 focus:border-gigas-500 sm:text-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </>
          ) : (
            <ReactMarkdown className="text-neutral-600">{JSON.stringify(block.input) || 'No prompt'}</ReactMarkdown>
          )}
        </div>
        {block?.events?.length ? (
          <div>
            <button
              type="button"
              className="flex items-start text-neutral-400 hover:text-neutral-600 -ml-1"
              onClick={() => setLogsHidden(!logsHidden)}
            >
              {logsHidden ? (
                <>
                  <ChevronDownIcon className="h-5 w-5 text-neutral-400" />
                  <span className="text-neutral-600 text-sm">Show output</span>
                </>
              ) : (
                <>
                  <ChevronUpIcon className="h-5 w-5 text-neutral-400" />
                  <span className="text-neutral-600 text-sm">Hide output</span>
                </>
              )}
            </button>
          </div>
        ) : null}

        {lastEvent && !logsHidden && (
          <div className="pt-4">
            <div className="flex flex-col gap-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => <h1 className="my-2 text-gray-900 text-lg font-semibold" {...props} />,
                  p: ({ ...props }) => <p className="text-gray-700 my-1 text-sm font-text" {...props} />,
                  li: ({ ...props }) => <li className="text-gray-600 my-1 text-sm" {...props} />,
                }}
                className="text-gray-600"
              >
                {lastEvent.output || ''}
              </ReactMarkdown>
              <p className="text-neutral-600 text-sm">
                Last event: {lastEvent.startedAt?.toLocaleDateString()}
                {lastEvent.startedAt?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
