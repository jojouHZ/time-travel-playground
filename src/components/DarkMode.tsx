import React, { useState, useEffect } from 'react';
import Button from '../Button';

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedMode: boolean = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = (): void => {
    const newMode: boolean = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="inline-flex rounded-full gap-2 items-center px-2 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-600 text-white
        dark:bg-white dark:hover:bg-amber-400 dark:text-gray-800 
        transition-colors duration-200"
    >
      {darkMode ? '🌞' : '🌙'}
    </button>
  );
};
