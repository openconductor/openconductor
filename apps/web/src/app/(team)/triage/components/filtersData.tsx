'use client';

import { api } from '@/lib/api';
import { Source, SourceType } from '@openconductor/db';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  GitHubLogoIcon,
  ShadowNoneIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';

export const labels = [
  {
    value: 'triage needed',
    label: 'Triage needed',
  },
  {
    value: 'good first issue',
    label: 'Good first issue',
  },
];

export const statuses = [
  {
    value: 'OPEN',
    label: 'Open',
    icon: CircleIcon,
  },
  {
    value: 'DRAFT',
    label: 'Draft',
    icon: StopwatchIcon,
  },
  {
    value: 'MERGED',
    label: 'Merged',
    icon: CheckCircledIcon,
  },

  {
    value: 'CLOSED',
    label: 'Closed',
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: 'No priority',
    value: undefined,
    icon: ShadowNoneIcon,
  },
  {
    label: 'Urgent',
    value: 'urgent',
    icon: ExclamationTriangleIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
];

export function sources() {
  const { data: sources, status: sourcesStatus } = api.source.all.useQuery(undefined, {
    enabled: true,
  });

  // if (sourcesStatus === 'success' && sources.length > 0) {
  const filterSources = sources?.map((source: Source) => ({
    label: source.name,
    value: source.sourceId,
    icon: source.type === SourceType.GITHUB_REPO ? GitHubLogoIcon : undefined,
  }));
  return filterSources;
  // }
}
