'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gauge, PaintBucket, RefreshCw } from 'lucide-react';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import SearchForm from '@/components/weather/SearchForm';
import WeatherCard from '@/components/weather/WeatherCard';
import ForecastCard from '@/components/weather/ForecastCard';
import { CardSkeleton, Skeleton } from '@/components/common/Loader';
import { fetchWeatherByCity, WeatherApiError } from '@/lib/api';
import { WeatherBundle } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';

const HIGHLIGHTS = [
  { icon: RefreshCw, title: 'Real-time Updates', description: 'Live weather data updated every few minutes.' },
  { icon: Gauge, title: 'Accurate Forecast', description: 'Advanced forecasting for your location.' },
  { icon: PaintBucket, title: 'Beautiful Design', description: 'Clean, responsive and easy to use interface.' },
];

export default function HomePage() {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof WeatherApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather('Islamabad');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="border-b border-border bg-white">
        <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
              Weather at your fingertips
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Real-time weather for <span className="text-primary">every moment</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-gray-600">
              Accurate forecasts, beautiful UI, and real-time data to help you plan your day better.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">Check Weather</Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="secondary">Learn More</Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-background px-4 py-3">
                  <item.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                  <p className="mt-2 text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <SearchForm onSearch={loadWeather} loading={loading} className="mx-auto lg:mx-0" />
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            {loading && !weather ? (
              <CardSkeleton />
            ) : weather ? (
              <WeatherCard data={weather.current} temperatureUnit={settings.temperatureUnit} windUnit={settings.windUnit} />
            ) : null}
            {loading && !weather ? (
              <div className="flex gap-3 rounded-2xl border border-border bg-white p-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-28 w-20 shrink-0 rounded-xl" />
                ))}
              </div>
            ) : weather ? (
              <ForecastCard days={weather.forecast.slice(0, 5)} temperatureUnit={settings.temperatureUnit} />
            ) : null}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-card transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Accurate Forecasts</h3>
            <p className="mt-2 text-sm text-gray-600">Up-to-date weather predictions tailored for you.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Weather Alerts</h3>
            <p className="mt-2 text-sm text-gray-600">Stay safe with timely weather notifications.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Air Quality</h3>
            <p className="mt-2 text-sm text-gray-600">Monitor pollution levels in your area.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
