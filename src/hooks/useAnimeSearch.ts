import { useState, useEffect } from 'react';
import { Anime } from '@/types/anime';
import { searchAnime } from '@/lib/anilist';

export function useAnimeSearch(query: string, delay = 300) {
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchAnime(query.trim());
        setResults(data);
      } catch (err) {
        setError('Failed to search anime');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, isLoading, error };
}
