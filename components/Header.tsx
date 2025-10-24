import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, GithubIcon } from './icons';

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
      <div className="flex items-center gap-2">
        <a 
          href="https://github.com/Eldoprano/Lenticular-Postcard-Generator/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full text-light-secondary dark:text-dark-secondary bg-light-bg-hover dark:bg-dark-bg-hover hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          aria-label="View source on GitHub"
        >
          <GithubIcon className="w-5 h-5" />
        </a>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-light-secondary dark:text-dark-secondary bg-light-bg-hover dark:bg-dark-bg-hover hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;