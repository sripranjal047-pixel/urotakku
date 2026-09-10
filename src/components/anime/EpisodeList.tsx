'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Episode } from '@/types/anime';
import { getAnimeEpisodes } from '@/lib/consumet';

interface EpisodeListProps {
  animeId: string;
}

export default function EpisodeList({ animeId }: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(24);

  useEffect(() => {
    async function loadEpisodes() {
      setIsLoading(true);
      const eps = await getAnimeEpisodes(animeId);
      setEpisodes(eps);
      setIsLoading(false);
    }
    loadEpisodes();
  }, [animeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No episodes available yet.</p>
        <p className="text-sm text-gray-600 mt-1">Episodes will appear once streaming sources are available.</p>
      </div>
    );
  }

  const visibleEpisodes = episodes.slice(0, displayCount);

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Episodes ({episodes.length})</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visibleEpisodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/watch/${encodeURIComponent(ep.id)}?anime=${animeId}&num=${ep.number}`}
            className="group relative bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-colors"
          >
            {ep.image ? (
              <div className="relative aspect-video">
                <Image
                  src={ep.image}
                  alt={`Episode ${ep.number}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-500 group-hover:text-[#F47521] transition-colors" />
              </div>
            )}
            <div className="p-2">
              <p className="text-xs font-semibold text-[#F47521]">EP {ep.number}</p>
              {ep.title && (
                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{ep.title}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {episodes.length > displayCount && (
        <button
          onClick={() => setDisplayCount((prev) => prev + 24)}
          className="mt-4 w-full py-2 text-sm text-[#F47521] hover:text-[#e06515] bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          Show More Episodes ({episodes.length - displayCount} remaining)
        </button>
      )}
    </div>
  );
}
