import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={cn('animate-spin text-primary', className)} />;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-white/10', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card dark:bg-white/5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}
