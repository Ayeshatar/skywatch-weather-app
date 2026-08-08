'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Sunrise, Sunset, Gauge, SunMedium } from 'lucide-react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import SearchForm from '@/components/weather/SearchForm';
import WeatherWidget from '@/components/weather/WeatherWidget';
import { CardSkeleton, Skeleton } from '@/components/common/Loader';
import { fetchAirQuality, fetchWeatherByCity, WeatherApiError, AirQualityData } from '@/lib/api';
import { WeatherBundle } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { formatTime } from '@/lib/utils';
import { t } from '@/lib/i18n';

export default function DashboardPage() {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      setError(err instanceof WeatherApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // require a logged-in profile (dev auth)
    try {
      const p = localStorage.getItem('profile');
      if (!p) {
        router.push('/login');
        return;
      }
    } catch (e) {}
    loadCity('Lahore');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aqiColor =
    airQuality && airQuality.aqi <= 50
      ? 'text-success'
      : airQuality && airQuality.aqi <= 100
      ? 'text-amber-500'
      : 'text-red-500';

  return (
    <div id="weather">
      <DashboardTopbar
        title={t('welcome', settings.language)}
        subtitle={t('overview', settings.language)}
        rightSlot={<SearchForm onSearch={loadCity} loading={loading} className="hidden sm:flex" placeholder={t('searchPlaceholder', settings.language)} />}
      />

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div id="forecast">
        {loading && !weather ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div className="lg:col-span-3"><Skeleton className="h-64 w-full rounded-2xl" /></div>
          </div>
        ) : weather ? (
          <WeatherWidget data={weather} temperatureUnit={settings.temperatureUnit} windUnit={settings.windUnit} />
        ) : null}
      </div>

      <div id="locations" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted" />
            <h4 className="text-sm font-semibold text-gray-700">{t('airQuality', settings.language)}</h4>
          </div>
          {loading && !airQuality ? (
            <Skeleton className="mt-4 h-10 w-20" />
          ) : airQuality ? (
            <>
              <p className={`mt-3 text-3xl font-bold ${aqiColor}`}>{airQuality.aqi}</p>
              <p className={`text-sm font-medium ${aqiColor}`}>{airQuality.category}</p>
              <p className="mt-2 text-xs text-muted">{t('airQualityInfo', settings.language)} {airQuality.category.toLowerCase()}.</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-amber-400 to-red-500"
                  style={{ width: `${Math.min(100, airQuality.aqi / 3)}%` }}
                />
              </div>
            </>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <AlertCircle className="h-4 w-4" /> {t('airQualityUnavailable', settings.language)}
            </div>
          )}
        </div>

        <div id="alerts" className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-gray-700">{t('todaysHighlights', settings.language)}</h4>
          {!settings.notifications.severeWeather ? (
            <div className="mt-4 rounded-md border border-border bg-muted/10 p-3 text-sm text-gray-700">
              {t('severeWeatherDisabled', settings.language)}
            </div>
          ) : loading && !weather ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : weather ? (
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><SunMedium className="h-4 w-4" /> UV Index</span>
                <span className="font-semibold text-gray-800">{weather.current.uvIndex.toFixed(0)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><Sunrise className="h-4 w-4" /> Sunrise</span>
                <span className="font-semibold text-gray-800">{weather.current.sunrise ? formatTime(weather.current.sunrise) : '—'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><Sunset className="h-4 w-4" /> Sunset</span>
                <span className="font-semibold text-gray-800">{weather.current.sunset ? formatTime(weather.current.sunset) : '—'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><Gauge className="h-4 w-4" /> Pressure</span>
                <span className="font-semibold text-gray-800">{weather.current.pressure} hPa</span>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
