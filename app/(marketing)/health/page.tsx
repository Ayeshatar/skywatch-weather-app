'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import { Skeleton } from '@/components/common/Loader';

type Status = 'loading' | 'success' | 'error';

interface HealthResult {
  timestamp: string;
  responseTimeMs: number;
  payload: unknown;
}

const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=31.55&longitude=74.34&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto';

export default function HealthCheckPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<HealthResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setStatus('loading');
    setError(null);
    const start = performance.now();
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`API responded with status ${res.status}`);
      const payload = await res.json();
      const end = performance.now();
      setResult({ timestamp: new Date().toISOString(), responseTimeMs: end - start, payload });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <Container className="py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Check</h1>
          <p className="mt-1 text-sm text-muted">API &amp; System Status</p>
        </div>
        <Button variant="secondary" size="sm" onClick={runCheck} disabled={status === 'loading'}>
          <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
          Re-check
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
        {status === 'loading' && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <p className="mt-3 font-semibold text-gray-900">Health check failed</p>
            <p className="mt-1 text-sm text-gray-600">{error}</p>
            <Button className="mt-5" size="sm" onClick={runCheck}>Try again</Button>
          </div>
        )}

        {status === 'success' && result && (
          <>
            <div className="mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">Healthy</span>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Status</p>
                <p className="mt-1 font-semibold text-success">Healthy</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Timestamp</p>
                <p className="mt-1 font-semibold text-gray-800">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Response Time</p>
                <p className="mt-1 font-semibold text-gray-800">{result.responseTimeMs.toFixed(0)} ms</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Sample API Response</p>
              <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs leading-relaxed text-green-400">
{JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
