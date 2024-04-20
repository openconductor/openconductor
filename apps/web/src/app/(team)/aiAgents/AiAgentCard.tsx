import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AiAgent, AiAgentType } from '@openconductor/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { api } from '@/lib/api';

export function AiAgentCard({ id, type, aiAgentId, name, url, description, createdAt, enabled }: AiAgent) {
  const utils = api.useUtils();

  const { mutate: deleteAiAgent } = api.aiAgent.delete.useMutation({
    onSuccess: () => {
      utils.aiAgent.all.invalidate();
    },
  });

  const { mutate: toggleAiAgent } = api.aiAgent.update.useMutation({
    onSuccess: () => {
      utils.aiAgent.all.invalidate();
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-5">
        <div className="flex justify-between items-center">
          <CardTitle>
            {name} {!enabled && 'disabled'}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={url} target="_blank">
                  Visit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleAiAgent({ id, enabled: !enabled })}>
                {enabled ? 'Disable' : 'Enable'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteAiAgent(id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 pr-10 h-10">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-5 text-sm text-muted-foreground">
          <div>
            <Link className="flex items-center text-sm transition-colors hover:text-primary" href={url} target="_blank">
              {type === AiAgentType.GITHUB_REPO && <GitHubLogoIcon className="h-4 w-4 mr-2" />}
              {aiAgentId}
            </Link>
          </div>
          <div>{format(createdAt, 'd MMM yyyy')}</div>
        </div>
      </CardContent>
    </Card>
  );
}
