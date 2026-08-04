import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { themes, ThemeMode, ColorTokens } from './themes';
import { spacing, radii, shadows, typography } from './tokens';

export type Theme = {
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  typography: typeof typography;
  mode: ThemeMode;
};

type ThemeContextValue = {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [overrideMode, setOverrideMode] = useState<ThemeMode | null>(null);

  const mode: ThemeMode = overrideMode ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const theme: Theme = useMemo(
    () => ({
      colors: themes[mode],
      spacing,
      radii,
      shadows,
      typography,
      mode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ theme, setMode: setOverrideMode as (m: ThemeMode) => void }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
