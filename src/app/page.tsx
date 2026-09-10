'use client';

import { useEffect, useState } from 'react';
import { getTrending, getPopular, getTopRated, getThisSeason } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import HeroBanner from '@/components/home/HeroBanner';
import AnimeCarousel from '@/components/home/AnimeCarousel';

export default function HomePage() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [thisSeason, setThisSeason] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [t, p, tr, ts] = await Promise.all([
          getTrending(1, 20),
          getPopular(1, 20),
          getTopRated(1, 20),
          getThisSeason(1, 20),
        ]);
        setTrending(t);
        setPopular(p);
        setTopRated(tr);
        setThisSeason(ts);
      } catch (error) {
        console.error('Failed to fetch anime data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {trending.length > 0 && <HeroBanner animeList={trending} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 py-8">
        <AnimeCarousel title="Trending Now" emoji="🔥" animeList={trending} isLoading={isLoading} />
        <AnimeCarousel title="This Season" emoji="🌸" animeList={thisSeason} isLoading={isLoading} />
        <AnimeCarousel title="Most Popular" emoji="⭐" animeList={popular} isLoading={isLoading} />
        <AnimeCarousel title="Top Rated" emoji="🏆" animeList={topRated} isLoading={isLoading} />
      </div>
    </div>
  );
}
