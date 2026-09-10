'use client';

import Image from 'next/image';
import { Anime } from '@/types/anime';
import { getDisplayTitle, formatScore } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <button
      onClick={() => openModal(anime)}
      className="flex-shrink-0 w-[160px] sm:w-[180px] group text-left"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5">
        <Image
          src={anime.coverImage.large}
          alt={getDisplayTitle(anime.title)}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 160px, 180px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Score badge */}
        {anime.averageScore && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">{formatScore(anime.averageScore)}</span>
          </div>
        )}

        {/* Status badge for airing */}
        {anime.status === 'RELEASING' && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#F47521] rounded-full">
            <span className="text-xs font-semibold text-white">Airing</span>
          </div>
        )}

        {/* Hover overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-gray-300 line-clamp-2">
            {anime.genres.slice(0, 3).join(' • ')}
          </p>
        </div>
      </div>

      <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-[#F47521] transition-colors">
        {getDisplayTitle(anime.title)}
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">
        {anime.format} {anime.episodes ? `• ${anime.episodes} eps` : ''}
      </p>
    </button>
  );
}
