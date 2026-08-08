import Link from 'next/link';
import { Signpost } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-primary-50">
          <Signpost className="h-20 w-20 text-primary" strokeWidth={1.5} />
        </div>
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Oops! Page not found</h1>
        <p className="mt-3 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-8">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </MainLayout>
  );
}
