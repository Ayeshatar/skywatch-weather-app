'use client';

import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { Spinner } from '@/components/common/Loader';

interface SearchFormProps {
  onSearch: (city: string) => void;
  loading?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  buttonLabel?: string;
  className?: string;
}

export default function SearchForm({
  onSearch,
  loading,
  placeholder = 'Enter city...',
  ariaLabel = 'Search for a city',
  buttonLabel = 'Search',
  className = '',
}: SearchFormProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-xl ${className}`} role="search">
      <label htmlFor="city-search" className="sr-only">
        {ariaLabel}
      </label>
      <input
        id="city-search"
        type="text"
        placeholder={placeholder}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 rounded-l-full border border-r-0 border-border bg-white px-5 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="City search"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-r-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
        aria-label={buttonLabel}
      >
        {loading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        <span className="hidden sm:inline">{buttonLabel}</span>
      </button>
    </form>
  );
}
