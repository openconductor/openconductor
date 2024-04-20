import { ActivityOptions } from '@temporalio/common';

export const defaultPolicy: ActivityOptions = {
  // recommended
  startToCloseTimeout: '30s',
  // useful
  scheduleToCloseTimeout: '1m',
  // The below is a Retry Policy. It is used to retry the Activity if it fails.
  retry: {
    // These are the values of the Default Retry Policy
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: Infinity,
    nonRetryableErrorTypes: [],
  },
};

export const longPolicy: ActivityOptions = {
  startToCloseTimeout: '30m',
  scheduleToCloseTimeout: '60m',
  heartbeatTimeout: '1m',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: Infinity,
    nonRetryableErrorTypes: [],
  },
};

export const heartbeatWatchPolicy: ActivityOptions = {
  ...longPolicy,
  heartbeatTimeout: '5m',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumInterval: '30s',
    maximumAttempts: Infinity,
    nonRetryableErrorTypes: [],
  },
};

export const infiniteWatchPolicy: ActivityOptions = {
  startToCloseTimeout: '7d',
  heartbeatTimeout: '1d',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 1,
    maximumAttempts: Infinity,
    nonRetryableErrorTypes: [],
  },
};

export const nonRetryPolicy: ActivityOptions = {
  // recommended
  startToCloseTimeout: '30s',
  // useful
  scheduleToCloseTimeout: '1m',
  // The below is a Retry Policy. It is used to retry the Activity if it fails.
  retry: {
    maximumAttempts: 1,
  },
};

export const longNonRetryPolicy: ActivityOptions = {
  startToCloseTimeout: '30m',
  scheduleToCloseTimeout: '60m',
  retry: {
    maximumAttempts: 1,
  },
};

export const localPolicy: ActivityOptions = {
  startToCloseTimeout: '2s',
};
