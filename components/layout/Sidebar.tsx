"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, CloudSun, LayoutDashboard, LogOut, MapPin, Settings, User, CalendarDays } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/weather', label: 'Weather', icon: CloudSun },
  { href: '/dashboard/forecast', label: 'Forecast', icon: CalendarDays },
  { href: '/dashboard/locations', label: 'Locations', icon: MapPin },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-white px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href.split('#')[0] && !item.href.includes('#');
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          // clear client state and redirect to home
          try {
            localStorage.removeItem('profile');
            localStorage.removeItem('clientId');
          } catch (e) {}
          router.push('/');
        }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
        Logout
      </button>
    </aside>
  );
}
