"use client";

import { useEffect, useState } from 'react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import SearchForm from '@/components/weather/SearchForm';
import { fetchWeatherByCity, fetchAirQuality, AirQualityData, WeatherApiError } from '@/lib/api';
import { WeatherBundle } from '@/lib/types';
import { CardSkeleton, Skeleton } from '@/components/common/Loader';
import WeatherCard from '@/components/weather/WeatherCard';
import { useSettings } from '@/context/SettingsContext';

export default function LocationsPage() {
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
      setError(err instanceof WeatherApiError ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCity('Lahore');
  }, []);

  return (
    <div>
      <DashboardTopbar title="Locations" subtitle="Saved locations and details" rightSlot={<SearchForm onSearch={loadCity} loading={loading} />} />
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-gray-700">Current Weather</h4>
          {loading && !weather ? (
            <CardSkeleton />
          ) : weather ? (
            <div className="mt-3">
              <WeatherCard data={weather.current} temperatureUnit={settings.temperatureUnit} windUnit={settings.windUnit} />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-gray-700">Air Quality</h4>
          {loading && !airQuality ? (
            <Skeleton className="mt-4 h-10 w-20" />
          ) : airQuality ? (
            <div className="mt-3">
              <p className="text-3xl font-bold">{airQuality.aqi}</p>
              <p className="mt-1 text-sm text-muted">{airQuality.category}</p>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}
