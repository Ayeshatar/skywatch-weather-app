# SkyWatch — Weather App

A modern weather forecast application built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS. Live weather data is powered by the free [Open-Meteo](https://open-meteo.com/) API — no API key required.

## Features

- **Home** — hero section with live city search, current conditions, and a 5-day strip.
- **About** — mission, vision, and values.
- **Features** — feature grid.
- **Dashboard** — sidebar layout with current weather, 7-day forecast, live air quality, and daily highlights (UV index, sunrise/sunset, pressure).
- **Settings** — temperature/wind units, language, notification toggles, and theme, persisted to `localStorage` and applied app-wide.
- **Profile** — account details with inline edit mode.
- **Contact** — validated contact form with success state.
- **Health Check** (`/health`) — live API status, response time, and sample JSON payload.
- **404** — custom not-found page.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

Push this project to a Git repository and import it in [Vercel](https://vercel.com/new) — no environment variables are required since weather data comes from Open-Meteo's free, keyless API.

```bash
npm run build
npm run start
```

## Project structure

```
app/
  (marketing)/        Home, About, Features, Contact, Health — header + footer layout
  (app)/               Dashboard, Settings, Profile — sidebar layout
  layout.tsx           Root layout, fonts, metadata, SettingsProvider
  not-found.tsx         Custom 404
components/
  common/               Header, Footer, Button, Container, Loader, Logo
  layout/               Sidebar, DashboardTopbar, MainLayout
  weather/               SearchForm, WeatherCard, ForecastCard, WeatherWidget, WeatherIcon
context/
  SettingsContext.tsx   Units, language, theme, notifications (persisted)
lib/
  api.ts                Open-Meteo geocoding, forecast, air-quality clients
  types.ts, utils.ts, weather-codes.ts
```

## Notes

- All pages are fully responsive, keyboard accessible, and respect `prefers-reduced-motion`.
- Weather and air-quality requests include loading skeletons, error states, and empty states.
- Dark mode is wired via a `dark` class on `<html>`, toggled from Settings.
