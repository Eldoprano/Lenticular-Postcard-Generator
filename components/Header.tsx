
import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="px-6 py-4 flex justify-between items-center bg-light-bg-alt dark:bg-dark-bg-alt border-b border-light-border dark:border-dark-border">
      <h1 className="text-xl font-bold text-light-fg dark:text-dark-fg">
        Lenticular Postcard Creator
      </h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-light-secondary dark:text-dark-secondary bg-light-bg-hover dark:bg-dark-bg-hover hover:bg-light-border dark:hover:bg-dark-border transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    </header>
  );
};

export default Header;
