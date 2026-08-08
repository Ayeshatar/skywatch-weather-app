import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from 'lucide-react';
import { getWeatherInfo } from '@/lib/weather-codes';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
  'cloud-snow': CloudSnow,
  'cloud-fog': CloudFog,
};

export default function WeatherIcon({
  code,
  className = 'h-8 w-8',
}: {
  code: number;
  className?: string;
}) {
  const info = getWeatherInfo(code);
  const Icon = ICON_MAP[info.icon] ?? CloudDrizzle;
  return <Icon className={cn(className)} strokeWidth={1.75} aria-hidden="true" />;
}
