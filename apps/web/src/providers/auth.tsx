'use client';
import { SessionProvider as SessionWrapper } from 'next-auth/react';

import React from 'react';

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionWrapper>{children}</SessionWrapper>;
};
