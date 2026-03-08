import { useEffect, useState, useCallback } from 'react';
import { getData, updateSettings, type UserSettings } from '@/lib/storage';

type Theme = UserSettings['theme'];

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getData().settings.theme || 'light');

  useEffect(() => {
    applyTheme(theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    updateSettings({ theme: t });
    applyTheme(t);
  }, []);

  return { theme, setTheme };
}

// Initialize theme on load (call once in App)
export function initTheme() {
  const theme = getData().settings.theme || 'light';
  applyTheme(theme);
}
