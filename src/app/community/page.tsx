'use client';

import { useEffect, useState } from 'react';
import { getTrending, getPopular } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import CommunityHubClient from '@/components/community/CommunityHubClient';
import { Loader2 } from 'lucide-react';

export default function CommunityPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trending, popular] = await Promise.all([
          getTrending(1, 12),
          getPopular(1, 12),
        ]);
        const seen = new Set<string>();
        const combined = [...trending, ...popular].filter(a => {
          if (seen.has(a.id)) return false;
          seen.add(a.id);
          return true;
        }).slice(0, 20);
        setAnimeList(combined);
      } catch {
        setAnimeList([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Anime Communities</h1>
      <p className="text-sm text-gray-500 mb-6">
        Join anime-specific communities and discuss your favorite shows with fellow otakus.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
        </div>
      ) : (
        <CommunityHubClient animeList={animeList} />
      )}
    </div>
  );
}
