import { Flame } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-[#F47521]" />
              <span className="text-lg font-bold text-white">
                Ur<span className="text-[#F47521]">Otaku</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-md">
              Your ultimate anime streaming and community platform.
              Discover, watch, and discuss your favorite anime with fellow otakus.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Browse</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-500 hover:text-[#F47521] transition-colors">Home</Link>
              <Link href="/search" className="block text-sm text-gray-500 hover:text-[#F47521] transition-colors">Search</Link>
              <Link href="/community" className="block text-sm text-gray-500 hover:text-[#F47521] transition-colors">Community</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Info</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Built with Next.js</p>
              <p className="text-sm text-gray-500">Data from AniList</p>
              <p className="text-sm text-gray-500">For educational use</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-center text-xs text-gray-600">
            © {new Date().getFullYear()} UrOtaku. All rights reserved. This site is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
