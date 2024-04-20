'use client';

import { Separator } from '@/components/ui/separator';
import { SourceCard } from './SourceCard';
import { SourceForm } from './SourceForm';
import { DialogButton } from '@/components/ui/dialog-button';
import { api } from '@/lib/api';

export default function Sources() {
  const { data: sources, status: sourcesStatus } = api.source.all.useQuery(undefined, {
    enabled: true,
  });

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between ">
        <h1 className="text-lg font-medium">Sources</h1>
        <DialogButton size="sm" variant="default" label="Add source">
          <SourceForm />
        </DialogButton>
      </div>
      <Separator />
      <div className="p-4">
        <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-4">
          {sourcesStatus === 'success' && sources.map((source) => <SourceCard {...source} />)}
        </div>
      </div>
    </>
  );
}
