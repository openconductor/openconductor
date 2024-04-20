'use client';

import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { SourceCard } from './SourceCard';
import { SourceForm } from './SourceForm';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function Sources() {
  const { data: sources, status: sourcesStatus, refetch } = api.source.all.useQuery(undefined, {
    enabled: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => setIsDialogOpen(false);
  const handleSuccess = () => {
    handleClose();
    refetch();
  };

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between">
        <h1 className="text-lg font-medium">Sources</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" onClick={() => setIsDialogOpen(true)}>Add source</Button>
          </DialogTrigger>
          <DialogContent>
            {}
            <SourceForm onClose={handleClose} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="p-4">
        <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-4">
          {sourcesStatus === 'success' && sources.map((source) => <SourceCard key={source.id} {...source} />)}
        </div>
      </div>
    </>
  );
}