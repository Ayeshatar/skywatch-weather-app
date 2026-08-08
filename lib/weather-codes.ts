// Maps WMO weather codes (used by Open-Meteo) to a description and a simple icon key.
export interface WeatherCodeInfo {
  description: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-snow' | 'cloud-fog';
}

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mostly clear', icon: 'cloud-sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Foggy', icon: 'cloud-fog' },
  48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { description: 'Light drizzle', icon: 'cloud-rain' },
  53: { description: 'Moderate drizzle', icon: 'cloud-rain' },
  55: { description: 'Dense drizzle', icon: 'cloud-rain' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  71: { description: 'Slight snow', icon: 'cloud-snow' },
  73: { description: 'Moderate snow', icon: 'cloud-snow' },
  75: { description: 'Heavy snow', icon: 'cloud-snow' },
  80: { description: 'Rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate showers', icon: 'cloud-rain' },
  82: { description: 'Violent showers', icon: 'cloud-rain' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm, hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm, heavy hail', icon: 'cloud-lightning' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { description: 'Unknown', icon: 'cloud' };
}
