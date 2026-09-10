'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAnime, getTrending } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import AnimeCard from '@/components/home/AnimeCard';
import { Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        if (q && q.trim()) {
          const data = await searchAnime(q.trim(), 1, 30);
          setResults(data);
        } else {
          const data = await getTrending(1, 30);
          setResults(data);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">
        {q ? `Search Results for "${q}"` : 'Browse Anime'}
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No anime found</p>
              <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
