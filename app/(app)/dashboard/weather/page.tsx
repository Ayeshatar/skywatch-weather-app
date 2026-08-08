"use client";

import { useEffect, useState } from 'react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import WeatherWidget from '@/components/weather/WeatherWidget';
import SearchForm from '@/components/weather/SearchForm';
import { fetchWeatherByCity, fetchAirQuality, AirQualityData, WeatherApiError } from '@/lib/api';
import { WeatherBundle } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { CardSkeleton, Skeleton } from '@/components/common/Loader';
import { t } from '@/lib/i18n';

export default function WeatherPage() {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCity = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      try {
        const aq = await fetchAirQuality(data.current.latitude, data.current.longitude);
        setAirQuality(aq);
      } catch {
        setAirQuality(null);
      }
    } catch (err) {
      setError(err instanceof WeatherApiError ? err.message : 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCity('Lahore');
  }, []);

  return (
    <div>
      <DashboardTopbar title={t('weatherTitle', settings.language)} subtitle={t('weatherSubtitle', settings.language)} rightSlot={<SearchForm onSearch={loadCity} loading={loading} placeholder={t('searchPlaceholder', settings.language)} />} />

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      {loading && !weather ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2"><CardSkeleton /></div>
          <div className="lg:col-span-3"><Skeleton className="h-64 w-full rounded-2xl" /></div>
        </div>
      ) : weather ? (
        <WeatherWidget data={weather} temperatureUnit={settings.temperatureUnit} windUnit={settings.windUnit} />
      ) : null}
    </div>
  );
}
