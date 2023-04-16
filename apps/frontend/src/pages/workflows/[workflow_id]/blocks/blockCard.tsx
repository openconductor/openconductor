import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Agent, Block, Event } from '@openconductor/db/types';
import clsx from 'clsx';
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
  const lastEvent = block.events[block.events.length - 1];

  return (
    <div
      className={clsx(
        'border-green-200' && lastEvent?.status === 'success',
        'border-red-200' && lastEvent?.status === 'error',
        'hover:shadow-lg rounded-xl border-2 border-neutral-200 hover:border-indigo-500 bg-white cursor-pointer',
      )}
    >
      <div className="px-4 py-5 sm:px-6">
        <div className="min-w-0 flex-1 justify-center py-2">
          <p className="font-semibold">{block.name}</p>
        </div>

        <div className="py-4">
          <ReactMarkdown className="text-neutral-600 whitespace-pre-line text-xs truncate h-8">
            {lastEvent?.output || 'No output'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
