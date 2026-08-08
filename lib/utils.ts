import { TemperatureUnit, WindUnit } from './types';

export function celsiusTo(unit: TemperatureUnit, celsius: number): number {
  return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
}

export function formatTemp(unit: TemperatureUnit, celsius: number): string {
  return `${celsiusTo(unit, celsius)}\u00b0${unit}`;
}

export function kmhTo(unit: WindUnit, kmh: number): number {
  return unit === 'mph' ? Math.round(kmh * 0.621371) : Math.round(kmh);
}

export function formatWind(unit: WindUnit, kmh: number): string {
  return `${kmhTo(unit, kmh)} ${unit === 'mph' ? 'mph' : 'km/h'}`;
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
