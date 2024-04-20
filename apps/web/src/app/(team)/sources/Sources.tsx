'use client';

import { SourceCard } from './SourceCard';
import { SourceForm } from './SourceForm';
import { DialogButton } from '@/components/ui/dialog-button';
import { api } from '@/lib/api';

export default function Sources() {
  const {
    data: sources,
    status: sourcesStatus,
    refetch,
  } = api.source.all.useQuery(undefined, {
    enabled: true,
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sources</h2>
          <p className="text-muted-foreground">Manage your sources.</p>
        </div>
        <DialogButton variant="default" label="Create">
          <SourceForm />
        </DialogButton>
      </div>
      <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-4">
        {sourcesStatus === 'success' && sources.map((source) => <SourceCard {...source} />)}
      </div>
    </div>
  );
}
