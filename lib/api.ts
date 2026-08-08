import { CurrentWeather, DailyForecast, WeatherBundle } from './types';
import { formatDayLabel } from './utils';

const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/forecast.json';
const OPEN_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherApiError extends Error {}

function ensureKey() {
  const key = process.env.WEATHERAPI_KEY;
  if (!key) throw new WeatherApiError('Missing WEATHERAPI_KEY in environment');
  return key;
}

export async function fetchWeatherByCoords(lat: number, lon: number, cityName = '', countryName = ''): Promise<WeatherBundle> {
  // Use WeatherAPI if key provided, otherwise fallback to Open-Meteo
  const key = process.env.WEATHERAPI_KEY;
  if (key) {
    const q = `${lat},${lon}`;
    const url = `${WEATHERAPI_URL}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&days=7&aqi=no&alerts=yes`;
    const res = await fetch(url);
    if (!res.ok) throw new WeatherApiError('Could not fetch weather data.');
    const data = await res.json();

    const loc = data.location;
    const cur = data.current;
    const days = data.forecast?.forecastday ?? [];

    const current: CurrentWeather = {
      city: cityName || loc.name,
      country: countryName || loc.country,
      temp: cur.temp_c,
      feelsLike: cur.feelslike_c,
      humidity: cur.humidity,
      windSpeed: cur.wind_kph,
      weatherCode: cur.condition?.code ?? 0,
      time: cur.last_updated,
      uvIndex: cur.uv ?? 0,
      sunrise: days[0]?.astro?.sunrise ?? '',
      sunset: days[0]?.astro?.sunset ?? '',
      pressure: Math.round(cur.pressure_mb ?? 0),
      latitude: loc.lat,
      longitude: loc.lon,
    };

    const forecast: DailyForecast[] = days.map((d: any, i: number) => ({
      date: d.date,
      label: formatDayLabel(d.date, i),
      tempMax: d.day.maxtemp_c,
      tempMin: d.day.mintemp_c,
      weatherCode: d.day.condition?.code ?? 0,
    }));

    const alerts: any[] = data.alerts?.alert ?? [];
    const mappedAlerts = alerts.map((a: any) => ({
      headline: a.headline || a.event || 'Alert',
      msg: a.msg || a.desc || '',
      severity: a.severity || a.level || '',
      effective: a.effective || a.date || '',
      expires: a.expires || a.ends || '',
    }));

    return { current, forecast, alerts: mappedAlerts };
  }

  // Open-Meteo fallback
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current_weather: 'true',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode',
    timezone: 'auto',
    forecast_days: '7',
  });
  const res = await fetch(`${OPEN_FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new WeatherApiError('Could not fetch weather data (fallback).');
  const data = await res.json();

  const current: CurrentWeather = {
    city: cityName || '',
    country: countryName || '',
    temp: data.current_weather?.temperature ?? 0,
    feelsLike: data.current_weather?.temperature ?? 0,
    humidity: 0,
    windSpeed: data.current_weather?.windspeed ?? 0,
    weatherCode: data.current_weather?.weathercode ?? 0,
    time: data.current_weather?.time ?? '',
    uvIndex: 0,
    sunrise: data.daily?.sunrise?.[0] ?? '',
    sunset: data.daily?.sunset?.[0] ?? '',
    pressure: 0,
    latitude: lat,
    longitude: lon,
  };

  const forecast: DailyForecast[] = (data.daily?.time || []).map((date: string, i: number) => ({
    date,
    label: formatDayLabel(date, i),
    tempMax: data.daily?.temperature_2m_max?.[i] ?? 0,
    tempMin: data.daily?.temperature_2m_min?.[i] ?? 0,
    weatherCode: data.daily?.weathercode?.[i] ?? 0,
  }));

  return { current, forecast };
}

export async function fetchWeatherByCity(query: string): Promise<WeatherBundle> {
  const key = process.env.WEATHERAPI_KEY;
  if (key) {
    const url = `${WEATHERAPI_URL}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&days=7&aqi=no&alerts=no`;
    const res = await fetch(url);
    if (!res.ok) throw new WeatherApiError(`Could not find "${query}" or fetch weather data.`);
    const data = await res.json();

    const loc = data.location;
    return fetchWeatherByCoords(loc.lat, loc.lon, loc.name, loc.country);
  }

  // Fallback geocode via Open-Meteo
  const geourl = `${OPEN_GEOCODE_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const gres = await fetch(geourl);
  if (!gres.ok) throw new WeatherApiError('Could not lookup location (fallback).');
  const gdata = await gres.json();
  if (!gdata.results || gdata.results.length === 0) throw new WeatherApiError(`We couldn't find "${query}".`);
  const best = gdata.results[0];
  const label = best.admin1 ? `${best.name}` : best.name;
  return fetchWeatherByCoords(best.latitude, best.longitude, label, best.country);
}

export interface AirQualityData {
  aqi: number;
  category: string;
}

function categorizeAqi(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  // WeatherAPI returns limited AQI in some plans; keep existing Open-Meteo fallback
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'us_aqi',
    timezone: 'auto',
  });
  const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
  if (!res.ok) throw new WeatherApiError('Could not fetch air quality data.');
  const data = await res.json();
  const aqi = Math.round(data.current?.us_aqi ?? 0);
  return { aqi, category: categorizeAqi(aqi) };
}
