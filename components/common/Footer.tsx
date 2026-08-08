import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500" aria-label="Footer">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/features" className="hover:text-primary">Features</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/health" className="hover:text-primary">Status</Link>
        </nav>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} SkyWatch. All rights reserved.</p>
      </div>
    </footer>
  );
}
