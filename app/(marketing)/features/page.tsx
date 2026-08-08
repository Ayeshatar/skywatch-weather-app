import type { Metadata } from 'next';
import { Bell, CloudSun, MapPin, Palette, Search, Umbrella } from 'lucide-react';
import Container from '@/components/common/Container';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore everything SkyWatch offers: real-time weather, 7-day forecasts, alerts, and more.',
};

const FEATURES = [
  { icon: CloudSun, title: 'Real-time Weather', description: 'Get live updates of current weather conditions.' },
  { icon: Umbrella, title: '7-day Forecast', description: 'Plan ahead with accurate 7-day weather forecast.' },
  { icon: MapPin, title: 'Location Based', description: 'Get weather updates for your current location.' },
  { icon: Search, title: 'Search Anywhere', description: 'Search weather for any city around the world.' },
  { icon: Bell, title: 'Weather Alerts', description: 'Stay notified about severe weather alerts.' },
  { icon: Palette, title: 'Clean UI/UX', description: 'Enjoy a clean and intuitive user experience.' },
];

export default function FeaturesPage() {
  return (
    <Container className="py-14">
      <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
        Features
      </span>
      <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
        Powerful features for <span className="text-primary">smarter weather tracking</span>
      </h1>
      <p className="mt-4 max-w-xl text-gray-600">Everything you need to stay informed about weather conditions.</p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-border bg-white p-6 shadow-card transition hover:shadow-lg">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <feature.icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
