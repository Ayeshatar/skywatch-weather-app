import { CloudSun } from 'lucide-react';
import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`} aria-label="SkyWatch home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <CloudSun className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">SkyWatch</span>
    </Link>
  );
}
