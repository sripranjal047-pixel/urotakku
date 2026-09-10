'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Tv, Clock, Users, MessageSquare, Loader2 } from 'lucide-react';
import { getAnimeById } from '@/lib/anilist';
import { Anime } from '@/types/anime';
import Badge from '@/components/ui/Badge';
import EpisodeList from '@/components/anime/EpisodeList';
import { getDisplayTitle, stripHtml, formatStatus, formatSeason, formatScore } from '@/lib/utils';

export default function AnimePage() {
  const params = useParams();
  const id = params.id as string;
  const [anime, setAnime] = useState<Anime | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const data = await getAnimeById(parseInt(id));
        setAnime(data);
      } catch {
        setError(true);
      }
    }
    if (id) fetchAnime();
  }, [id]);

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

  const displayTitle = getDisplayTitle(anime.title);

  return (
    <div>
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            src={anime.coverImage.extraLarge}
            alt={displayTitle}
            fill
            className="object-cover blur-md"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover image */}
          <div className="relative w-48 h-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-[#0a0a0a] mx-auto md:mx-0">
            <Image
              src={anime.coverImage.extraLarge}
              alt={displayTitle}
              fill
              className="object-cover"
              priority
              sizes="192px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{displayTitle}</h1>
            {anime.title.native && (
              <p className="text-gray-400 mt-1">{anime.title.native}</p>
            )}

            {/* Stats */}
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
                  <span>{anime.duration} min/ep</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatSeason(anime.season, anime.seasonYear)}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant={anime.status === 'RELEASING' ? 'green' : anime.status === 'FINISHED' ? 'blue' : 'default'}>
                {formatStatus(anime.status)}
              </Badge>
              {anime.format && <Badge>{anime.format}</Badge>}
              {anime.studios.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
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
              <p className="text-sm text-gray-300 mt-4 leading-relaxed max-w-3xl">
                {stripHtml(anime.description)}
              </p>
            )}

            {/* Community link */}
            <Link
              href={`/community/${anime.id}`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Join Community Discussion
            </Link>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-8">
          <EpisodeList animeId={anime.id} />
        </div>
      </div>
    </div>
  );
}
