'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background px-4 py-16 text-center text-gray-900 dark:bg-[#0B1120] dark:text-gray-100">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white/90 px-8 py-12 shadow-xl backdrop-blur dark:bg-white/5">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">An unexpected error occurred while loading this page.</p>
        <p className="mt-4 text-xs text-muted break-words">{error?.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
