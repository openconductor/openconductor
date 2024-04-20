import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
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
