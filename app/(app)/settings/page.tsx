'use client';

import DashboardTopbar from '@/components/layout/DashboardTopbar';
import { useSettings } from '@/context/SettingsContext';
import Toggle from './Toggle';
import { Language, TemperatureUnit, Theme, WindUnit, AppSettings } from '@/lib/types';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function SettingsPage() {
  const { settings, setTemperatureUnit, setWindUnit, setLanguage, setTheme, toggleNotification, hydrated } = useSettings();
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (hydrated) setDraft(settings);
  }, [hydrated, settings]);

  if (!hydrated) {
    return (
      <div>
        <DashboardTopbar title="Settings" subtitle="Manage your preferences" />
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-card" />
      </div>
    );
  }

  return (
    <div>
      <DashboardTopbar title={t('settingsTitle', settings.language)} subtitle={t('settingsSubtitle', settings.language)} />

      <div className="space-y-6">
        <SettingsSection title={t('general', settings.language)}>
          <Row label={t('temperatureUnit', settings.language)}>
            <Select<TemperatureUnit>
              value={draft?.temperatureUnit ?? settings.temperatureUnit}
              onChange={(v) => setDraft((d) => (d ? { ...d, temperatureUnit: v } : d))}
              options={[
                { value: 'C', label: '°C' },
                { value: 'F', label: '°F' },
              ]}
            />
          </Row>
          <Row label={t('windSpeedUnit', settings.language)}>
            <Select<WindUnit>
              value={draft?.windUnit ?? settings.windUnit}
              onChange={(v) => setDraft((d) => (d ? { ...d, windUnit: v } : d))}
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
              ]}
            />
          </Row>
          <Row label={t('language', settings.language)}>
            <Select<Language>
              value={draft?.language ?? settings.language}
              onChange={(v) => setDraft((d) => (d ? { ...d, language: v } : d))}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Urdu', label: 'اردو' },
                { value: 'Spanish', label: 'Español' },
                { value: 'French', label: 'Français' },
              ]}
            />
          </Row>
        </SettingsSection>

        <SettingsSection title={t('notifications', settings.language)}>
          <Row label={t('weatherAlerts', settings.language)}>
            <Toggle
              checked={draft?.notifications.weatherAlerts ?? settings.notifications.weatherAlerts}
              onChange={() => setDraft((d) => (d ? { ...d, notifications: { ...d.notifications, weatherAlerts: !d.notifications.weatherAlerts } } : d))}
              label={t('weatherAlerts', settings.language)}
            />
          </Row>
          <Row label={t('dailyForecast', settings.language)}>
            <Toggle
              checked={draft?.notifications.dailyForecast ?? settings.notifications.dailyForecast}
              onChange={() => setDraft((d) => (d ? { ...d, notifications: { ...d.notifications, dailyForecast: !d.notifications.dailyForecast } } : d))}
              label={t('dailyForecast', settings.language)}
            />
          </Row>
          <Row label={t('severeWeather', settings.language)}>
            <Toggle
              checked={draft?.notifications.severeWeather ?? settings.notifications.severeWeather}
              onChange={() => setDraft((d) => (d ? { ...d, notifications: { ...d.notifications, severeWeather: !d.notifications.severeWeather } } : d))}
              label={t('severeWeather', settings.language)}
            />
          </Row>
        </SettingsSection>

        <SettingsSection title={t('appearance', settings.language)}>
          <Row label={t('theme', settings.language)}>
            <Select<Theme>
              value={draft?.theme ?? settings.theme}
              onChange={(v) => setDraft((d) => (d ? { ...d, theme: v } : d))}
              options={[
                { value: 'light', label: t('light', settings.language) },
                { value: 'dark', label: t('dark', settings.language) },
              ]}
            />
          </Row>
        </SettingsSection>
      </div>
      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={async () => {
            if (!draft) return;
            setSaving(true);
            setSaveMsg(null);
            try {
              // apply to context (ensure theme is applied first so dark class updates immediately)
                setTheme(draft.theme);
                setTemperatureUnit(draft.temperatureUnit);
                setWindUnit(draft.windUnit);
                setLanguage(draft.language);
              // notifications toggles: set directly via toggleNotification only when different
              const notifKeys: (keyof AppSettings['notifications'])[] = ['weatherAlerts', 'dailyForecast', 'severeWeather'];
              notifKeys.forEach((k) => {
                const desired = draft.notifications[k];
                const current = settings.notifications[k];
                if (desired !== current) toggleNotification(k);
              });

              const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draft),
              });
              const data = await res.json();
              if (res.ok && data.ok) {
                setSaveMsg(t('settingsSaved', draft.language));
                // reload to ensure server-rendered parts pick up changes
                setTimeout(() => {
                  try {
                    window.location.reload();
                  } catch (e) {}
                }, 400);
              } else {
                setSaveMsg(data.error || 'Save failed');
              }
            } catch (e: any) {
              setSaveMsg(e.message || 'Save failed');
            } finally {
              setSaving(false);
            }
          }}
          className="ml-3 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? t('saving', settings.language) : t('updateButton', settings.language)}
        </button>
        {saveMsg && (
          <span className="ml-4 text-lg font-medium text-muted/80">{saveMsg}</span>
        )}
      </div>
    </div>
  );
}
