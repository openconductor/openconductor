import { ChevronDownIcon, CircleIcon, OpenInNewWindowIcon, PlusIcon, StarIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Source } from '@openconductor/db';
import { format } from 'date-fns';
import Link from 'next/link';

export function SourceCard({ name, url, description, createdAt }: Source) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Link href={url} target="_blank">
            <Button variant="secondary" className="px-3 shadow-none">
              <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
              Open
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div>{format(createdAt, 'd MMM yyyy')}</div>
        </div>
      </CardContent>
    </Card>
  );
}
