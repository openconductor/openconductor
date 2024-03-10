import React, { useState } from 'react';
import { api } from '~/utils/api';
import Link from 'next/link';
import Markdown from 'react-markdown';
import Label from '~/components/shared/label';
import Button, { ButtonVariant } from '~/components/shared/button';

export function Message({ messageId }: { messageId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: message,
    status: messageStatus,
    refetch,
  } = api.message.byId.useQuery(
    {
      id: messageId,
    },
    {
      enabled: true,
    },
  );

  return (
    messageStatus === 'success' &&
    message && (
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Link href={message.url!} target="_blank">
            {message.key}
          </Link>
          {message.state}
        </div>
        <div>
          <div className="flex items-center gap-2">
            {message.labels.map((label, index) => (
              <div key={index}>
                <Label name={label.name ?? ''} color={label.color ?? ''} />
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-neutral-800 rounded-lg">
          <p>AI</p>
          <ul className="list-disc text-neutral-300 space-y-1 p-4">
            <li>Summary</li>
            <li>Similar messages</li>
            <li>Suggested labels</li>
            <li>Suggested reply</li>
            <li>Suggested action</li>
          </ul>
        </div>
        <div className="p-5 bg-neutral-900 rounded-lg space-y-5">
          <p>Context</p>
          <div className={`pre ${!isExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
            <Markdown className="text-base space-y-4 text-neutral-300">{message.body}</Markdown>
          </div>
          <Button variant={ButtonVariant.Secondary} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        <div className="p-5 bg-neutral-900 rounded-lg space-y-5">
          <p>Activity</p>
          {message?.children.map((comment) => (
            <div className="">
              <div className={`pre ${!isExpanded ? 'max-h-48 overflow-hidden' : ''}`} key={comment.id}>
                <Markdown className="text-base space-y-4 text-neutral-300">{comment?.body}</Markdown>
              </div>
              <Button variant={ButtonVariant.Secondary} onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
