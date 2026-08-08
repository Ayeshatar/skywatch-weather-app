import { WeatherBundle, TemperatureUnit, WindUnit } from '@/lib/types';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';

interface WeatherWidgetProps {
  data: WeatherBundle;
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
}

export default function WeatherWidget({ data, temperatureUnit, windUnit }: WeatherWidgetProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <WeatherCard data={data.current} temperatureUnit={temperatureUnit} windUnit={windUnit} variant="dark" />
      </div>
      <div className="lg:col-span-3">
        <ForecastCard days={data.forecast} temperatureUnit={temperatureUnit} variant="list" />
      </div>
    </div>
  );
}
