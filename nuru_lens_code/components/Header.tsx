import Link from 'next/link';
import { Eye, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 py-4 min-h-16">
          <Link href="/" className="flex items-center shrink-0">
            <Eye className="h-8 w-8 text-green-600" aria-hidden />
            <span className="ml-2 text-xl font-bold text-gray-900">NuruLens</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Home</Link>
            <Link href="/candidates" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Candidates</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Leaderboard</Link>
            <Link href="/watchdog" className="text-gray-600 hover:text-green-600 font-medium transition-colors flex items-center gap-1.5">
              <Shield className="h-4 w-4" aria-hidden />
              Watchdog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}