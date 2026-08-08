'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppSettings, Language, TemperatureUnit, Theme, WindUnit } from '@/lib/types';

const STORAGE_KEY = 'skywatch-settings';

const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'C',
  windUnit: 'kmh',
  language: 'English',
  theme: 'light',
  notifications: {
    weatherAlerts: true,
    dailyForecast: true,
    severeWeather: false,
  },
};

interface SettingsContextValue {
  settings: AppSettings;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindUnit) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleNotification: (key: keyof AppSettings['notifications']) => void;
  hydrated: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    try {
      // debug log to help verify updates
      // eslint-disable-next-line no-console
      console.debug('Settings updated:', settings);
    } catch {}
    // ensure theme applies to both html and body for immediate visual effect
    const isDark = settings.theme === 'dark';
    try {
      document.documentElement.classList.toggle('dark', isDark);
      if (document.body) document.body.classList.toggle('dark', isDark);
      const langMap: Record<Language, string> = {
        English: 'en',
        Urdu: 'ur',
        Spanish: 'es',
        French: 'fr',
      };
      document.documentElement.lang = langMap[settings.language] || 'en';
    } catch {}
  }, [settings, hydrated]);

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    setSettings((s) => ({ ...s, temperatureUnit: unit }));
  }, []);

  const setWindUnit = useCallback((unit: WindUnit) => {
    setSettings((s) => ({ ...s, windUnit: unit }));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setSettings((s) => ({ ...s, language: lang }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const toggleNotification = useCallback((key: keyof AppSettings['notifications']) => {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [key]: !s.notifications[key] },
    }));
  }, []);

  const value = useMemo(
    () => ({ settings, setTemperatureUnit, setWindUnit, setLanguage, setTheme, toggleNotification, hydrated }),
    [settings, setTemperatureUnit, setWindUnit, setLanguage, setTheme, toggleNotification, hydrated]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
