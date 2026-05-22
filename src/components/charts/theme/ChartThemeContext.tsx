/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CHART_PRESETS } from './theme';
import type { ChartThemeName, ChartColorPreset } from './theme';

export interface ChartThemeContextType {
  mode: 'light' | 'dark';
  presetName: ChartThemeName;
  preset: ChartColorPreset;
  setPresetName: (preset: ChartThemeName) => void;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
}

const ChartThemeContext = createContext<ChartThemeContextType | undefined>(undefined);

interface ChartThemeProviderProps {
  children: React.ReactNode;
  defaultPreset?: ChartThemeName;
  defaultMode?: 'light' | 'dark' | 'auto';
}

export const ChartThemeProvider: React.FC<ChartThemeProviderProps> = ({
  children,
  defaultPreset = 'default',
  defaultMode = 'auto',
}) => {
  const [presetName, setPresetName] = useState<ChartThemeName>(defaultPreset);
  const [modeSetting, setModeSetting] = useState<'light' | 'dark' | 'auto'>(defaultMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (modeSetting !== 'auto') {
      setResolvedMode(modeSetting);
      return;
    }

    // Auto mode: Check if document has .dark class or matchMedia prefers-color-scheme: dark
    const checkMode = () => {
      const isDarkClass = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark');
      if (isDarkClass) {
        setResolvedMode('dark');
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
    };

    checkMode();

    // Listen to changes in the class list of html/body
    const observer = new MutationObserver(() => {
      checkMode();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Listen to media query changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (modeSetting === 'auto') {
        checkMode();
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [modeSetting]);

  const preset = CHART_PRESETS[presetName];

  return (
    <ChartThemeContext.Provider
      value={{
        mode: resolvedMode,
        presetName,
        preset,
        setPresetName,
        setMode: setModeSetting,
      }}
    >
      {children}
    </ChartThemeContext.Provider>
  );
};

export const useChartTheme = (): ChartThemeContextType => {
  const context = useContext(ChartThemeContext);
  if (!context) {
    // If not wrapped, return sensible default settings
    return {
      mode: 'light',
      presetName: 'default',
      preset: CHART_PRESETS.default,
      setPresetName: () => {},
      setMode: () => {},
    };
  }
  return context;
};
