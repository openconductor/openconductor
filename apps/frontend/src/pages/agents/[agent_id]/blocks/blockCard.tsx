import { Agent, Block, Event } from '@openconductor/db/types';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

export default function BlockCard({
  block,
}: {
  block: Block & {
    agent: Agent | null;
    events: Event[];
  };
}) {
  const lastEvent = block.events[block.events.length - 1];
  console.log('block', block);
  const parseChat = function (output?: string, status?: string) {
    return `${output?.split('Action:')[0]}`;
  };

  const parsePlugin = function (name?: string) {
    return `${name?.split('-')[0]}`;
  };

  const statusPlugin = function (status?: string) {
    return `${status === 'success' ? 'Used' : ''}${status === 'started' ? 'Using' : ''}${
      status === 'error' ? 'Tried' : ''
    }`;
  };

  return (
    <>
      {block.order === 0 ? (
        <div
          key={block.id}
          className="font-medium text-sm rounded-xl p-4 dark:text-white border-2 border-neutral-200 dark:border-neutral-700 dark:hover:border-neutral-800 cursor-pointer"
        >
          <ReactMarkdown className="whitespace-pre-line text-md truncate">{block.input}</ReactMarkdown>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={clsx(
              '!border-neutral-200 !dark:bg-neutral-800' && lastEvent?.status === 'started',
              '!border-green-200' && lastEvent?.status === 'success',
              '!bg-red-200' && lastEvent?.status === 'error',
              'w-fit font-medium text-sm rounded-md px-3.5 py-1.5 text-white  bg-indigo-800 hover:bg-indigo-700 cursor-pointer',
            )}
          >
            {block.name === 'end' ? (
              'Finished'
            ) : (
              <>
                {statusPlugin(lastEvent?.status)}
                <span className="ml-1 font-bold">{parsePlugin(block.name)}</span>
              </>
            )}
          </div>
          <div className="space-y-5">
            {block.events &&
              block.events.map((event, index) => {
                return (
                  <div
                    key={event.id}
                    className={clsx(
                      event.status === 'started' && '!dark:bg-neutral-800',
                      event.status === 'success' && '!float-right',
                      event.status === 'error' && '!bg-neutral-900 !float-right',
                      'w-4/5 font-medium text-sm rounded-xl px-4 py-3 text-neutral-800 dark:text-neutral-200 border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 max-h-80 overflow-hidden',
                    )}
                  >
                    <ReactMarkdown className="whitespace-pre-line text-md truncate">
                      {parseChat(event.output!, event.status)}
                    </ReactMarkdown>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
