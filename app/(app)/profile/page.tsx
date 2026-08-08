'use client';

import { useEffect, useState } from 'react';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import Button from '@/components/common/Button';

interface UserProfile {
  fullName: string;
  email: string;
  location: string;
  memberSince: string;
  avatar?: string;
}

const PROFILE: UserProfile = {
  fullName: 'Ayesha Tariq',
  email: 'ayesha@example.com',
  location: 'Lahore, Pakistan',
  memberSince: 'May 2024',
};

const DETAIL_ROWS: { label: string; key: keyof Omit<UserProfile, 'avatar'> }[] = [
  { label: 'Full Name', key: 'fullName' },
  { label: 'Email', key: 'email' },
  { label: 'Location', key: 'location' },
  { label: 'Member Since', key: 'memberSince' },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => PROFILE);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      // ignore
    }

    // client id for active users
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('clientId', clientId);
    }

    const ping = async () => {
      try {
        await fetch('/api/active', { method: 'POST', body: JSON.stringify({ id: clientId }), headers: { 'Content-Type': 'application/json' } });
        const res = await fetch('/api/active');
        if (res.ok) {
          const data = await res.json();
          setActiveCount(data.active ?? 0);
        }
      } catch (err) {
        // ignore
      }
    };

    ping();
    const t = setInterval(ping, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <DashboardTopbar title="Profile" subtitle="Your account information" />

      <div className="max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div>
            <img
              src={profile?.avatar || 'https://i.pravatar.cc/128?img=47'}
              alt={`${profile.fullName} avatar`}
              width={72}
              height={72}
              className="rounded-full border border-border"
            />
            {editing && (
              <div className="mt-2 text-center">
                <input
                  aria-label="Upload avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setAvatarFileName(f.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result as string;
                      setProfile((p) => ({ ...p, avatar: result }));
                    };
                    reader.readAsDataURL(f);
                  }}
                  className="mt-1 text-xs"
                />
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900">{profile.fullName}</h2>
            <p className="text-sm text-muted">{profile.email}</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3">
            {activeCount !== null && (
              <div className="text-sm text-muted">Users active: <span className="font-medium text-gray-900">{activeCount}</span></div>
            )}
            <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
            {editing && (
              <Button size="sm" onClick={() => {
                localStorage.setItem('profile', JSON.stringify(profile));
                window.dispatchEvent(new Event('profile-updated'));
                setEditing(false);
              }}>
                Save
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Account Details</h3>
          <dl className="divide-y divide-border">
            {DETAIL_ROWS.map((row) => (
              <div key={row.key} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <dt className="text-gray-500">{row.label}</dt>
                {editing && row.key !== 'memberSince' ? (
                  <input
                    value={(profile as any)[row.key]}
                    onChange={(e) => setProfile((p) => ({ ...p, [row.key]: e.target.value }))}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                ) : (
                  <dd className="font-medium text-gray-800">{(profile as any)[row.key]}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
