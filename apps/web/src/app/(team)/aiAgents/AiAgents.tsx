'use client';

import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { AiAgentCard } from './AiAgentCard';
import { AiAgentForm } from './AiAgentForm';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function AiAgents() {
  const { data: aiAgents, status: AiAgentsStatus, refetch } = api.aiAgent.all.useQuery(undefined, {
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
        <h1 className="text-lg font-medium">AI Agents</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" onClick={() => setIsDialogOpen(true)}>Add Agent</Button>
          </DialogTrigger>
          <DialogContent>
            {}
            <AiAgentForm onClose={handleClose} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="p-4">
        <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-4">
          {AiAgentsStatus === 'success' && aiAgents.map((aiAgent) => <AiAgentCard key={aiAgent.id} {...aiAgent} />)}
        </div>
      </div>
    </>
  );
}