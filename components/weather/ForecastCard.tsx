import { DailyForecast, TemperatureUnit } from '@/lib/types';
import { formatTemp } from '@/lib/utils';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  days: DailyForecast[];
  temperatureUnit: TemperatureUnit;
  variant?: 'row' | 'list' | 'grid';
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ForecastCard({ days, temperatureUnit, variant = 'row' }: ForecastCardProps) {
  if (variant === 'list') {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
        <h4 className="mb-3 text-sm font-semibold text-gray-800">7-Day Forecast</h4>
        <ul className="divide-y divide-border">
          {days.map((day) => (
            <li key={day.date} className="flex items-center justify-between py-2.5 text-sm">
              <span className="w-20 font-medium text-gray-700">{day.label}</span>
              <WeatherIcon code={day.weatherCode} className="h-5 w-5 text-primary" />
              <span className="text-gray-500">{formatTemp(temperatureUnit, day.tempMin)}</span>
              <span className="font-semibold text-gray-800">{formatTemp(temperatureUnit, day.tempMax)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((day) => (
          <div key={day.date} className="rounded-2xl border border-border bg-white p-4 text-center shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">{day.label}</div>
            <div className="mt-2 text-sm text-gray-500">{formatDateLabel(day.date)}</div>
            <div className="my-3 flex items-center justify-center">
              <WeatherIcon code={day.weatherCode} className="h-10 w-10 text-primary" />
            </div>
            <div className="text-sm text-gray-500">Low {formatTemp(temperatureUnit, day.tempMin)}</div>
            <div className="text-lg font-semibold text-gray-800">{formatTemp(temperatureUnit, day.tempMax)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto rounded-2xl border border-border bg-white p-4 shadow-card">
      {days.map((day) => (
        <div
          key={day.date}
          className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-xl bg-background px-2 py-3 text-center transition hover:shadow-md"
        >
          <span className="text-xs font-semibold text-gray-600">{day.label}</span>
          <WeatherIcon code={day.weatherCode} className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-gray-800">{formatTemp(temperatureUnit, day.tempMax)}</span>
        </div>
      ))}
    </div>
  );
}
