'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, MessageSquare } from 'lucide-react';
import { Anime } from '@/types/anime';
import { getDisplayTitle } from '@/lib/utils';

interface CommunityCardProps {
  anime: Anime;
  postCount: number;
}

export default function CommunityCard({ anime, postCount }: CommunityCardProps) {
  const title = getDisplayTitle(anime.title);

  return (
    <Link
      href={`/community/${anime.id}`}
      className="group block bg-[#1a1a2e] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#F47521]/50 transition-all"
    >
      {/* Banner */}
      <div className="relative h-24 overflow-hidden">
        <Image
          src={anime.bannerImage || anime.coverImage.extraLarge}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 relative">
        <div className="flex items-end gap-3">
          <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[#1a1a2e] shadow-lg">
            <Image
              src={anime.coverImage.large}
              alt={title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-[#F47521] transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                {Math.floor(Math.random() * 500) + 50} members
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="w-3 h-3" />
                {postCount} posts
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {anime.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
