'use client';

import { useTheme } from 'next-themes';
import React from 'react';

const ToggleTheme = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  console.log('currentTheme', currentTheme);
  return (
    <button
      onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
      className="bg-neutral-800 dark:bg-neutral-50 hover:bg-neutral-600 dark:hover:bg-neutral-300 transition-all duration-100 px-8 py-2 text-2xl md:text-4xl rounded-lg absolute bottom-32"
    >
      Toggle Mode
    </button>
  );
};

export default ToggleTheme;
