"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    setSuggestion(null);
    const emailVal = (email || '').trim().toLowerCase();
    const nameVal = (name || '').trim() || 'Guest';
    if (!emailVal) {
      setError('Please enter an email.');
      return;
    }

    // stricter email check
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(emailVal)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const raw = localStorage.getItem('profile');
      if (raw) {
        const existing = JSON.parse(raw);
        const existingEmail = existing?.email?.toLowerCase?.();
        if (existingEmail) {
          if (existingEmail === emailVal) {
            setError('This email is already in use. If this is your account, proceed to Dashboard or logout to switch.');
            return;
          }
          // detect close typos (edit distance <=2)
          const dist = levenshteinDistance(existingEmail, emailVal);
          if (dist > 0 && dist <= 2) {
            setSuggestion(existingEmail);
            setError('Email looks like a typo.');
            return;
          }
        }
      }
      const profile = { fullName: nameVal, email: emailVal };
      localStorage.setItem('profile', JSON.stringify(profile));
    } catch (e) {
      // ignore storage errors
    }

    router.push('/dashboard');
  };

  function levenshteinDistance(a: string, b: string) {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 shadow-card">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <p className="mb-6 text-sm text-muted">Enter a name and email to continue (dev login).</p>
        <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mb-4 w-full rounded-lg border border-border px-3 py-2" />
        <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-border px-3 py-2" />
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {suggestion && (
          <div className="mb-4 flex items-center gap-3">
            <div className="text-sm text-muted">Did you mean</div>
            <button
              onClick={() => {
                setEmail(suggestion);
                setSuggestion(null);
                setError(null);
                // proceed to login immediately
                const profile = { fullName: name || 'Guest', email: suggestion };
                try {
                  localStorage.setItem('profile', JSON.stringify(profile));
                } catch (e) {}
                router.push('/dashboard');
              }}
              className="rounded px-2 py-1 text-sm text-primary underline"
            >
              {suggestion}
            </button>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </Container>
  );
}
