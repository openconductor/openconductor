'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';

import { AiItemType } from '@openconductor/db';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LabelColor } from '@/components/ui/label';
import { useMessage } from '../use-message';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical } from 'lucide-react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Textarea } from '@/components/ui/textarea';

export type ResponseSummary = {
  summary: string;
  bullets: string[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export function Message() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [areBulletsVisible, setAreBulletsVisible] = useState(false);
  const [visibleSuggestionIndex, setVisibleSuggestionIndex] = useState<number | null>(null);

  const { selectedMessage } = useMessage();

  const messageId = selectedMessage?.id;

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

  const { data: similarMessages } = api.message.similar.useQuery(
    {
      messageId: messageId,
    },
    {
      enabled: true,
    },
  );

  const { mutateAsync: aiMessage, isLoading } = api.message.ai.useMutation();

  const handleAiMessage = async () => {
    await aiMessage({ messageId });
    refetch();
  };

  console.log('similarMessages', similarMessages?.length, similarMessages);

  useEffect(() => {
    const toggleBulletsVisibility = (event: KeyboardEvent) => {
      if (event.key === 'm' || event.key === 'M') {
        setAreBulletsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', toggleBulletsVisibility);

    return () => {
      window.removeEventListener('keydown', toggleBulletsVisibility);
    };
  }, []);

  return (
    messageStatus === 'success' &&
    message && (
      <div className="relative">
        <div className="flex items-center px-4 py-2 h-[52px]">
          <h2 className="text-md">{message.key}</h2>
          <div className="ml-auto flex items-center gap-2">
            <Link className="text-xs" href={message.url!} target="_blank">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <OpenInNewWindowIcon className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open on {message.source.sourceId}</TooltipContent>
              </Tooltip>
            </Link>
          </div>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!messageId}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  void handleAiMessage();
                }}
              >
                Augment with AI
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {message.labels.map((label, index) => (
                <div key={index}>
                  <LabelColor name={label.name ?? ''} color={label.color ?? ''} />
                </div>
              ))}
            </div>
          </div>
          <div className="my-5 p-5 bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-900/50 dark:to-blue-950/50 rounded-lg space-y-5">
            {isLoading && 'Loading....'}
            {message.aiItems &&
              message.aiItems.map((aiItem, index) => {
                if (aiItem.type === AiItemType.SUMMARY) {
                  const response = aiItem.response as unknown as ResponseSummary;
                  return (
                    <div key={index} className="space-y-5">
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">AI Summary</p>
                        <p onClick={() => setAreBulletsVisible(!areBulletsVisible)}>
                          {response.summary}{' '}
                          <Button variant="secondary">M - {areBulletsVisible ? 'Collapse' : 'Expand'}</Button>
                        </p>
                        {areBulletsVisible && (
                          <ul className="text-sm list-disc dark:text-neutral-300 space-y-1 px-4">
                            {response.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">AI Priority</p>
                        <p>{response.priority}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">
                          AI Suggestions
                        </p>
                        <div className="space-y-2">
                          {response.suggestions?.map((suggestion, suggestionIndex) => {
                            return (
                              <>
                                <div key={suggestionIndex} className="flex">
                                  <Button
                                    variant="secondary"
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
                return null;
              })}
            {similarMessages && similarMessages.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">AI Similar</p>
                <ul className="text-sm list-disc dark:text-neutral-300 space-y-1 px-4">
                  {similarMessages.map((similarMessage, similarMessageIndex) => (
                    <li key={similarMessageIndex}>{similarMessage.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="p-5 bg-neutral-100 dark:bg-neutral-900 rounded-lg space-y-5">
            <p className="text-xs font-medium uppercase dark:text-neutral-400/50">Context</p>
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
              <Markdown className="text-base space-y-4 dark:text-neutral-300">{message.body}</Markdown>
            </div>
            <Button variant="secondary" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          <div className="p-5 dark:bg-neutral-900 rounded-lg space-y-5">
            <p className="text-xs font-medium uppercase dark:text-neutral-400/50">Activity</p>
            <div className="space-y-5">
              {message?.children.map((comment) => (
                <div className="p-5 dark:bg-neutral-800">
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
                    <Markdown className="text-base space-y-4 dark:text-neutral-300">{comment?.body}</Markdown>
                  </div>
                  <Button variant="secondary" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Separator className="mt-auto" />
        <div className="p-4 bg-white dark:bg-neutral-900 z-50">
          <div className="max-w-3xl mx-auto w-full">
            <form>
              <div className="grid gap-4">
                <Textarea className="p-4" placeholder={`Ask AI ...`} />
                <div className="flex items-center">
                  <Button onClick={(e) => e.preventDefault()} size="sm" className="ml-auto">
                    Ask AI
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
