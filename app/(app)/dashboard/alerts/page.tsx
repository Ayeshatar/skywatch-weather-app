"use client";

import { useEffect, useState } from 'react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import SearchForm from '@/components/weather/SearchForm';
import { fetchWeatherByCity, WeatherApiError } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import { Skeleton } from '@/components/common/Loader';
import { t } from '@/lib/i18n';

export default function AlertsPage() {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCity = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof WeatherApiError ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // only load alerts when user has enabled weather alerts in settings
    if (settings.notifications.weatherAlerts) {
      loadCity('Lahore');
    } else {
      setWeather(null);
      setLoading(false);
    }
  }, [settings.notifications.weatherAlerts]);

  return (
    <div>
      <DashboardTopbar
        title={t('alertsTitle', settings.language)}
        subtitle={t('alertsSubtitle', settings.language)}
        rightSlot={<SearchForm onSearch={loadCity} loading={loading} placeholder={t('searchPlaceholder', settings.language)} ariaLabel={t('searchAriaLabel', settings.language)} buttonLabel={t('searchButton', settings.language)} />}
      />
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        {!settings.notifications.weatherAlerts ? (
          <div className="p-4">
            <div className="rounded-md border border-border bg-muted/10 p-4 text-sm text-gray-700">
              {t('weatherAlertsDisabled', settings.language)}{' '}
              <a href="/settings" className="font-medium text-primary underline">{t('alertsTitle', settings.language)}</a>
            </div>
          </div>
        ) : loading && !weather ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">{t('activeAlerts', settings.language)}</h4>
              <button
                onClick={() => {
                  // simulate dev alert
                  const sample = [{ headline: 'Test Storm Warning', msg: 'Heavy rain expected in 2 hours.', severity: 'Severe' }];
                  setWeather((w: any) => ({ ...(w || {}), alerts: sample }));
                }}
                className="rounded bg-primary px-3 py-1 text-sm text-white"
              >
                {t('simulateAlert', settings.language)}
              </button>
            </div>
            {weather?.alerts && weather.alerts.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {weather.alerts.map((a: any, idx: number) => (
                  <li key={idx} className="rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                    <div className="text-sm font-semibold text-gray-800">{a.headline}</div>
                    <div className="mt-1 text-xs text-gray-700">{a.msg}</div>
                    {a.severity && <div className="mt-1 text-xs text-muted">Severity: {a.severity}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-muted">{t('noActiveAlerts', settings.language)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
