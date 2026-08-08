"use client";

import { useEffect, useState } from 'react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import ForecastCard from '@/components/weather/ForecastCard';
import SearchForm from '@/components/weather/SearchForm';
import { fetchWeatherByCity, WeatherApiError } from '@/lib/api';
import { WeatherBundle } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { Skeleton } from '@/components/common/Loader';
import { t } from '@/lib/i18n';

export default function ForecastPage() {
  const { settings } = useSettings();
  const [forecast, setForecast] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCity = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setForecast(data);
    } catch (err) {
      setError(err instanceof WeatherApiError ? err.message : 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings.notifications.dailyForecast) {
      loadCity('Lahore');
    } else {
      setForecast(null);
      setLoading(false);
    }
  }, [settings.notifications.dailyForecast]);

  return (
    <div>
      <DashboardTopbar
        title={t('forecastTitle', settings.language)}
        subtitle={t('forecastSubtitle', settings.language)}
        rightSlot={<SearchForm onSearch={loadCity} loading={loading} placeholder={t('searchPlaceholder', settings.language)} ariaLabel={t('searchAriaLabel', settings.language)} buttonLabel={t('searchButton', settings.language)} />}
      />
      {!settings.notifications.dailyForecast ? (
        <div className="mb-4 rounded-md border border-border bg-muted/10 p-3 text-sm text-gray-700">
          {t('dailyForecastDisabled', settings.language)}{' '}
          <a href="/settings" className="font-medium text-primary underline">{t('forecastTitle', settings.language)}</a>
        </div>
      ) : (
        <>
          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
          {loading && !forecast ? (
            <Skeleton className="h-48 w-full rounded-2xl" />
          ) : forecast ? (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">{t('forecastTitle', settings.language)}</h3>
              <ForecastCard days={forecast.forecast} temperatureUnit={settings.temperatureUnit} variant="grid" />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
