'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAnimeById } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import CommunityPageClient from '@/components/community/CommunityPageClient';
import { Loader2 } from 'lucide-react';

export default function CommunityAnimePage() {
  const params = useParams();
  const animeId = params.animeId as string;
  const [anime, setAnime] = useState<Anime | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const data = await getAnimeById(parseInt(animeId));
        setAnime(data);
      } catch {
        setError(true);
      }
    }
    if (animeId) fetchAnime();
  }, [animeId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Anime not found</p>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
      </div>
    );
  }

  return <CommunityPageClient anime={anime} />;
}
