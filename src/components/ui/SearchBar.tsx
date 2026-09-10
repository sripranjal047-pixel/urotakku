'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchAnime } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import { getDisplayTitle } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const openModal = useAppStore((state) => state.openModal);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchAnime(query.trim(), 1, 6);
          setResults(data);
          setIsOpen(true);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (anime: Anime) => {
    setIsOpen(false);
    setQuery('');
    openModal(anime);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#F47521]/50 focus:ring-1 focus:ring-[#F47521]/50 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F47521] animate-spin" />
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {results.map((anime) => (
            <button
              key={anime.id}
              onClick={() => handleResultClick(anime)}
              className="flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors text-left"
            >
              <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={anime.coverImage.large}
                  alt={getDisplayTitle(anime.title)}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getDisplayTitle(anime.title)}
                </p>
                <p className="text-xs text-gray-400">
                  {anime.format} • {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
                  {anime.averageScore ? ` • ${(anime.averageScore / 10).toFixed(1)}★` : ''}
                </p>
              </div>
            </button>
          ))}
          <button
            onClick={() => { setIsOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`); }}
            className="w-full p-3 text-center text-sm text-[#F47521] hover:bg-white/5 transition-colors border-t border-white/10"
          >
            View all results →
          </button>
        </div>
      )}
    </div>
  );
}
