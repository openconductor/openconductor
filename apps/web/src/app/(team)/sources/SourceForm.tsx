'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { SourceType } from '@openconductor/db';

interface SourceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SourceForm({ onClose, onSuccess }: SourceFormProps) {
  const [url, setUrl] = useState('');
  const { data: teamData } = api.team.activeTeam.useQuery();
  const utils = api.useUtils();
  const { mutateAsync: createSource, isLoading } = api.source.create.useMutation({
    onSuccess: () => {
      onSuccess();
      utils.source.all.invalidate();
      onClose();
      utils.source.all.invalidate();
    },
  });

  const handleSaveSource = async (event: React.FormEvent) => {
    event.preventDefault();
    await createSource({ type: SourceType.GITHUB_REPO, url, teamId: teamData?.id ?? '' });
  };

  return (
    <form onSubmit={handleSaveSource}>
      <div className="grid gap-4 p-4">
        <Label htmlFor="url">URL</Label>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL" />
      </div>
      <div className="flex justify-end p-4">
        <Button type="submit" disabled={isLoading}>
          Add source
        </Button>
      </div>
    </form>
  );
}
