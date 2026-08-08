'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ fullName?: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      setProfile(null);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('profile');
      localStorage.removeItem('clientId');
    } catch (e) {}
    setProfile(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur dark:bg-[#0B1120]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  active ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          {!profile ? (
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:inline">
                <Button size="sm" variant="secondary">Dashboard</Button>
              </Link>
              <button onClick={handleLogout} className="rounded-md bg-red-50 px-3 py-1 text-sm text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
        <button
          className="rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2">
              <Button className="w-full">Get Started</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
