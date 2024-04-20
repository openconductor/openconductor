'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { AiAgentType } from '@openconductor/db';

interface AiAgentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AiAgentForm({ onClose, onSuccess }: AiAgentFormProps) {
  const [url, setUrl] = useState('');
  const { data: teamData } = api.team.activeTeam.useQuery();
  const utils = api.useUtils();
  const { mutateAsync: createAiAgent, isLoading } = api.aiAgent.create.useMutation({
    onSuccess: () => {
      onSuccess();
      utils.aiAgent.all.invalidate();
      onClose();
      utils.aiAgent.all.invalidate();
    },
  });

  const handleSaveAiAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    await createAiAgent({ type: AiAgentType.GITHUB_REPO, url, teamId: teamData?.id ?? '' });
  };

  return (
    <form onSubmit={handleSaveAiAgent}>
      <div className="grid gap-4 p-4">
        <Label htmlFor="url">URL</Label>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL" />
      </div>
      <div className="flex justify-end p-4">
        <Button type="submit" disabled={isLoading}>
          Add AI Agent
        </Button>
      </div>
    </form>
  );
}
