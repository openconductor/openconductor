import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Source, SourceType } from '@openconductor/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { api } from '@/lib/api';

export function SourceCard({ id, type, sourceId, name, url, description, createdAt, enabled }: Source) {
  const utils = api.useUtils();

  const { mutate: deleteSource } = api.source.delete.useMutation({
    onSuccess: () => {
      utils.source.all.invalidate();
    },
  });

  const { mutate: toggleSource } = api.source.update.useMutation({
    onSuccess: () => {
      utils.source.all.invalidate();
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-5">
        <div className="flex justify-between items-center">
          <CardTitle className={!enabled ? 'opacity-50' : ''}>{name}</CardTitle>
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
              <DropdownMenuItem onClick={() => toggleSource({ id, enabled: !enabled })}>
                {enabled ? 'Disable' : 'Enable'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteSource(id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 pr-10 h-10">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-5 text-sm text-muted-foreground">
          <div>
            <Link className="flex items-center text-sm transition-colors hover:text-primary" href={url} target="_blank">
              {type === SourceType.GITHUB_REPO && <GitHubLogoIcon className="h-4 w-4 mr-2" />}
              {sourceId}
            </Link>
          </div>
          <div>{format(createdAt, 'd MMM yyyy')}</div>
        </div>
      </CardContent>
    </Card>
  );
}
