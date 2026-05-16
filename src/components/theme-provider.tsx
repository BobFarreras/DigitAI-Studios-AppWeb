/**
 * @file src/components/theme-provider.tsx
 * @updated 2026-05-16
 * @summary Client theme context without inline script rendering.
 * @scope Applies light/dark/system class state to the document root.
 */
'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

export function ThemeProvider({ children, defaultTheme = 'system', enableSystem = true }: Props) {
  const [theme, setThemeState] = React.useState<Theme>(() => getInitialTheme(defaultTheme));

  React.useEffect(() => {
    const resolvedTheme = resolveTheme(theme, enableSystem);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    window.localStorage.setItem('digitai-theme', theme);
  }, [theme, enableSystem]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

function resolveTheme(theme: Theme, enableSystem: boolean) {
  if (theme !== 'system' || !enableSystem) return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(defaultTheme: Theme) {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = window.localStorage.getItem('digitai-theme');
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme;
}
