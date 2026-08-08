import { Droplets, Wind } from 'lucide-react';
import { CurrentWeather, TemperatureUnit, WindUnit } from '@/lib/types';
import { getWeatherInfo } from '@/lib/weather-codes';
import { formatTemp, formatWind } from '@/lib/utils';
import WeatherIcon from './WeatherIcon';

interface WeatherCardProps {
  data: CurrentWeather;
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
  variant?: 'light' | 'dark';
}

export default function WeatherCard({ data, temperatureUnit, windUnit, variant = 'light' }: WeatherCardProps) {
  const info = getWeatherInfo(data.weatherCode);
  const isDark = variant === 'dark';

  return (
    <div
      className={
        isDark
          ? 'rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-6 text-white shadow-card'
          : 'rounded-2xl border border-border bg-white p-6 shadow-card'
      }
    >
      <p className={isDark ? 'text-sm text-white/80' : 'text-sm text-muted'}>
        {data.city}
        {data.country ? `, ${data.country}` : ''}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="text-4xl font-bold">{formatTemp(temperatureUnit, data.temp)}</h3>
          <p className={isDark ? 'mt-1 text-white/90' : 'mt-1 text-gray-600'}>{info.description}</p>
        </div>
        <WeatherIcon code={data.weatherCode} className={isDark ? 'h-16 w-16 text-white' : 'h-16 w-16 text-primary'} />
      </div>
      <div className={`mt-5 flex items-center gap-5 border-t pt-4 text-sm ${isDark ? 'border-white/20 text-white/90' : 'border-border text-gray-600'}`}>
        <span className="flex items-center gap-1.5">
          <Droplets className="h-4 w-4" /> {Math.round(data.humidity)}%
        </span>
        <span className="flex items-center gap-1.5">
          <Wind className="h-4 w-4" /> {formatWind(windUnit, data.windSpeed)}
        </span>
        <span>Feels like {formatTemp(temperatureUnit, data.feelsLike)}</span>
      </div>
    </div>
  );
}
