import React, { useState } from 'react';
import { api } from '~/utils/api';
import Link from 'next/link';
import Markdown from 'react-markdown';
import Label from '~/components/shared/label';
import Button, { ButtonVariant } from '~/components/shared/button';
import PageHeading from '~/components/shared/pageHeading';
import { AiItemType } from '@openconductor/db';
import Image from 'next/image';

export type ResponseSummary = {
  summary: string;
  bullets: String[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export function Message({ messageId }: { messageId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [areBulletsVisible, setAreBulletsVisible] = useState(false);
  const [visibleSuggestionIndex, setVisibleSuggestionIndex] = useState<number | null>(null);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);

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

  const { mutateAsync: aiMessage } = api.message.ai.useMutation();

  const handleAiMessage = async () => {
    setLoadingMessageId(messageId);
    await aiMessage({ messageId });
    refetch();
    setLoadingMessageId(null);
  };

  const isLoading = loadingMessageId === messageId;

  return (
    messageStatus === 'success' &&
    message && (
      <div className="p-5 space-y-5">
        <PageHeading title={message.key} description={message.state ?? ''}>
          <div className="flex items-center gap-5">
            <Link href={message.url!} target="_blank">
              View on {message.source}
            </Link>
            <Button
              variant={ButtonVariant.Secondary}
              onClick={(event) => {
                event.preventDefault();
                void handleAiMessage();
              }}
              loading={isLoading}
            >
              {isLoading ? 'Augmenting' : 'Augment with AI'}
            </Button>
          </div>
        </PageHeading>
        <div>
          <div className="flex items-center gap-2">
            {message.labels.map((label, index) => (
              <div key={index}>
                <Label name={label.name ?? ''} color={label.color ?? ''} />
              </div>
            ))}
          </div>
        </div>
        <div className="my-5 p-5 bg-gradient-to-br from-blue-900/50 to-blue-950/50 rounded-lg">
          {message.aiItems &&
            message.aiItems.map((aiItem, index) => {
              if (aiItem.type === AiItemType.SUMMARY) {
                const response = aiItem.response as unknown as ResponseSummary;
                return (
                  <div key={index} className="space-y-5">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-blue-400/50">AI Summary</p>
                      <p onClick={() => setAreBulletsVisible(!areBulletsVisible)}>{response.summary}</p>
                      {areBulletsVisible && (
                        <ul className="text-sm list-disc text-neutral-300 space-y-1 px-4">
                          {response.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-blue-400/50">AI Priority</p>
                      <p>{response.priority}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-blue-400/50">AI Suggestions</p>
                      <div className="space-y-2">
                        {response.suggestions?.map((suggestion, suggestionIndex) => {
                          return (
                            <>
                              <div key={suggestionIndex} className="flex">
                                <Button
                                  variant={ButtonVariant.Secondary}
                                  onClick={() =>
                                    setVisibleSuggestionIndex(
                                      visibleSuggestionIndex === suggestionIndex ? null : suggestionIndex,
                                    )
                                  }
                                >
                                  {suggestion.cta}
                                </Button>
                              </div>
                              <div>{visibleSuggestionIndex === suggestionIndex && <div>{suggestion.body}</div>}</div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Or any other fallback for non-summary items
            })}
        </div>
        <div className="p-5 bg-neutral-900 rounded-lg space-y-5">
          <p className="text-xs font-medium uppercase text-neutral-400/50">Context</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={message.author?.imageUrl ?? ''}
              alt={message.author?.handle}
              width={20}
              height={20}
              className="h-5 w-5 rounded-full mr-2"
            />
            {message.author?.handle}
          </div>
          <div className={`pre ${!isExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
            <Markdown className="text-base space-y-4 text-neutral-300">{message.body}</Markdown>
          </div>
          <Button variant={ButtonVariant.Secondary} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        <div className="p-5 bg-neutral-900 rounded-lg space-y-5">
          <p className="text-xs font-medium uppercase text-neutral-400/50">Activity</p>
          <div className="space-y-5">
            {message?.children.map((comment) => (
              <div className="p-5 bg-neutral-800">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    src={comment.author?.imageUrl ?? ''}
                    alt={comment.author?.handle}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                  {comment.author?.handle}
                </div>
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
      </div>
    )
  );
}
