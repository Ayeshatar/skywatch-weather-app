export type TemperatureUnit = 'C' | 'F';
export type WindUnit = 'kmh' | 'mph';
export type Language = 'English' | 'Urdu' | 'Spanish' | 'French';
export type Theme = 'light' | 'dark';

export interface GeocodeResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface DailyForecast {
  date: string;
  label: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface WeatherAlert {
  headline: string;
  msg: string;
  severity?: string;
  effective?: string;
  expires?: string;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  pressure: number;
  latitude: number;
  longitude: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  forecast: DailyForecast[];
  alerts?: WeatherAlert[];
}

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
  language: Language;
  theme: Theme;
  notifications: {
    weatherAlerts: boolean;
    dailyForecast: boolean;
    severeWeather: boolean;
  };
}
