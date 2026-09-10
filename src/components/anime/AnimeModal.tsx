'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check, Star, Calendar, Tv, Clock, Users } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { getDisplayTitle, stripHtml, formatStatus, formatSeason, formatScore } from '@/lib/utils';

export default function AnimeModal() {
  const { selectedAnime: anime, isModalOpen, closeModal, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();

  if (!anime) return null;

  const inWatchlist = isInWatchlist(anime.id);
  const displayTitle = getDisplayTitle(anime.title);

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      {/* Banner */}
      <div className="relative w-full h-48 md:h-56">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={displayTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        ) : (
          <Image
            src={anime.coverImage.extraLarge}
            alt={displayTitle}
            fill
            className="object-cover blur-sm"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-6 pb-6 -mt-16">
        <div className="flex gap-4">
          {/* Cover image */}
          <div className="relative w-28 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-xl border-2 border-[#1a1a2e]">
            <Image
              src={anime.coverImage.extraLarge}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          {/* Title & meta */}
          <div className="flex-1 pt-16">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {displayTitle}
            </h2>
            {anime.title.native && (
              <p className="text-sm text-gray-400 mt-0.5">{anime.title.native}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
          {anime.averageScore && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-white">{formatScore(anime.averageScore)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Tv className="w-4 h-4" />
            <span>{anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'}</span>
          </div>
          {anime.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{anime.duration} min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatSeason(anime.season, anime.seasonYear)}</span>
          </div>
        </div>

        {/* Status & format */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={anime.status === 'RELEASING' ? 'green' : anime.status === 'FINISHED' ? 'blue' : 'default'}>
            {formatStatus(anime.status)}
          </Badge>
          {anime.format && <Badge>{anime.format}</Badge>}
          {anime.studios.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              {anime.studios.join(', ')}
            </div>
          )}
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mt-4">
          {anime.genres.map((genre) => (
            <Badge key={genre} variant="orange">{genre}</Badge>
          ))}
        </div>

        {/* Description */}
        {anime.description && (
          <p className="text-sm text-gray-300 mt-4 leading-relaxed line-clamp-5">
            {stripHtml(anime.description)}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Link
            href={`/anime/${anime.id}`}
            onClick={closeModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F47521] hover:bg-[#e06515] text-white font-semibold rounded-xl transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Now
          </Link>
          <button
            onClick={() => inWatchlist ? removeFromWatchlist(anime.id) : addToWatchlist(anime)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors ${
              inWatchlist
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {inWatchlist ? 'In Watchlist' : 'Add to List'}
          </button>
          <Link
            href={`/community/${anime.id}`}
            onClick={closeModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
          >
            <Users className="w-4 h-4" />
            Community
          </Link>
        </div>
      </div>
    </Modal>
  );
}
