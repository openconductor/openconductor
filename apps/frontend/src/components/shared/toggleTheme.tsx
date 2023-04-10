'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { useTheme } from 'next-themes';
import React from 'react';

const ToggleTheme = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div
      onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
      className="p-2 text-gray-500 hover:text-gray-600 dark:text-white "
    >
      {currentTheme == 'dark' ? (
        <SunIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </div>
  );
};

export default ToggleTheme;
