'use client';

import { ReactNode, useEffect, useState } from 'react';

interface DashboardTopbarProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function DashboardTopbar({ title, subtitle, rightSlot }: DashboardTopbarProps) {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = () => {
      try {
        const raw = window.localStorage.getItem('profile');
        if (!raw) {
          setAvatar(null);
          return;
        }
        const profile = JSON.parse(raw) as { avatar?: string };
        setAvatar(profile?.avatar || null);
      } catch {
        setAvatar(null);
      }
    };

    loadAvatar();
    window.addEventListener('storage', loadAvatar);
    window.addEventListener('profile-updated', loadAvatar);
    return () => {
      window.removeEventListener('storage', loadAvatar);
      window.removeEventListener('profile-updated', loadAvatar);
    };
  }, []);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {rightSlot}
        <img
          src={avatar || 'https://i.pravatar.cc/64?img=47'}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full border border-border"
        />
      </div>
    </div>
  );
}
