import React, { useEffect } from 'react';
import { useNotesStore } from '../../store/notesStore';
import type { Theme, Font } from '../../types';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): string {
  if (theme === 'system') return getSystemTheme() === 'dark' ? 'theme-dark' : '';
  if (theme === 'light') return '';
  return `theme-${theme}`;
}

function getFontClass(font: Font): string {
  const map: Record<Font, string> = {
    'sf-pro': '',
    'roboto': 'font-roboto',
    'georgia': 'font-georgia',
    'mono': 'font-mono',
  };
  return map[font] || '';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, font } = useNotesStore((s) => s.settings);

  useEffect(() => {
    const themeClass = resolveTheme(theme);
    const fontClass = getFontClass(font);
    
    // Remove all theme/font classes
    document.documentElement.classList.remove('theme-dark', 'theme-ocean', 'theme-forest', 'theme-sunset');
    document.body.classList.remove('font-roboto', 'font-georgia', 'font-mono');
    
    if (themeClass) document.documentElement.classList.add(themeClass);
    if (fontClass) document.body.classList.add(fontClass);

    // Listen for system theme changes
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        document.documentElement.classList.remove('theme-dark');
        if (mq.matches) document.documentElement.classList.add('theme-dark');
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, font]);

  return <>{children}</>;
}