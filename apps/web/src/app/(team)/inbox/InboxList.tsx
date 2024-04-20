import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiItemType, Label, Message } from '@openconductor/db';
import { useMessage } from '../triage/use-message';
import { SparklesIcon } from 'lucide-react';
import { LabelColor } from '@/components/ui/label';
import { ResponseSummary } from '../triage/@message/Message';

export function InboxList({ messages }: { messages?: Message[] }) {
  const { selectedMessage, selectMessage } = useMessage();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0 ">
        {messages?.map((message) => {
          const response = message.aiItems?.[0]?.response as unknown as ResponseSummary;
          return (
            <button
              key={message.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                selectedMessage?.id === message.id && 'bg-muted',
              )}
              onClick={() => selectMessage(message)}
            >
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="">
                    <div className="font-semibold line-clamp-1">
                      {message.key} {message.source?.name}
                    </div>
                    <div className="font-semibold line-clamp-1">{message.title}</div>
                    {/* {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />} */}
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xs line-clamp-1',
                      selectedMessage?.id === message.id ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <p className="flex text-xs text-blue-500 items-center">
                  <SparklesIcon className="h-3 w-3 mr-1" aria-hidden="true" />{' '}
                  <span className="line-clamp-1">{response?.summary}</span>
                </p>
              </div>
              <div className="line-clamp-4 text-xs text-muted-foreground max-w-md">
                {response?.bullets ? (
                  <ul className="text-xs list-disc dark:text-neutral-300 space-y-1 px-4">
                    {response.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  message.body.substring(0, 300)
                )}
              </div>
              <div className="h-8">
                {message.labels?.length ? (
                  <div className="flex items-center gap-2">
                    {message.labels.map((label: Label) => (
                      <LabelColor name={label.name} color={label.color!} />
                    ))}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
