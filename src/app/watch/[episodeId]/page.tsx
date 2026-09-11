'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, ExternalLink, Tv, Film, Sparkles, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import VideoPlayer from '@/components/player/VideoPlayer';
import { getStreamSources, getAnimeEpisodes } from '@/lib/consumet';
import { getAnimeById } from '@/lib/anilist';
import { StreamData, Episode, Anime } from '@/types/anime';
import { getDisplayTitle } from '@/lib/utils';

type ServerType = 'vidsrc' | 'autoembed' | 'trailer' | 'custom';

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const episodeId = decodeURIComponent(params.episodeId as string);
  const animeId = searchParams.get('anime') || '';
  const episodeNum = searchParams.get('num') || '1';

  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeServer, setActiveServer] = useState<ServerType>('vidsrc');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [stream, eps, animeData] = await Promise.all([
          getStreamSources(episodeId),
          animeId ? getAnimeEpisodes(animeId) : Promise.resolve([]),
          animeId ? getAnimeById(parseInt(animeId)).catch(() => null) : Promise.resolve(null),
        ]);

        if (stream && stream.sources.length > 0) {
          setStreamData(stream);
          setActiveServer('custom');
        }
        setEpisodes(eps);
        setAnime(animeData);
      } catch (error) {
        console.error('Failed to load anime or episodes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [episodeId, animeId]);

  const currentEpIndex = episodes.findIndex(ep => ep.id === episodeId);
  const prevEpisode = currentEpIndex > 0 ? episodes[currentEpIndex - 1] : null;
  const nextEpisode = currentEpIndex < episodes.length - 1 ? episodes[currentEpIndex + 1] : null;

  const animeTitle = anime ? getDisplayTitle(anime.title) : 'Anime';
  const crunchyrollUrl = `https://www.crunchyroll.com/search?q=${encodeURIComponent(animeTitle)}`;

  // Video embed URLs
  const vidsrcEmbed = `https://vidsrc.cc/v2/embed/anime/${animeId}/${episodeNum}`;
  const autoembedUrl = `https://multiembed.mov/?video_id=${animeId}&mal=1`;
  const trailerEmbed = anime?.trailer?.id
    ? `https://www.youtube-nocookie.com/embed/${anime.trailer.id}?autoplay=1`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          {animeId && (
            <Link
              href={`/anime/${animeId}`}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#F47521] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {animeTitle}
            </Link>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>{animeTitle}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#F47521]/20 text-[#F47521] font-semibold">
              Episode {episodeNum}
            </span>
          </h1>
        </div>

        {/* External Official Link */}
        <a
          href={crunchyrollUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#F47521]/20 hover:text-[#F47521] text-xs font-semibold text-gray-300 transition-colors w-fit"
        >
          <Tv className="w-4 h-4 text-[#F47521]" />
          <span>Watch on Crunchyroll</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Server Selector Bar */}
      <div className="bg-[#141420] p-3 rounded-xl mb-4 border border-white/5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 mr-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F47521]" />
          Streaming Servers:
        </span>

        <button
          onClick={() => setActiveServer('vidsrc')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeServer === 'vidsrc'
              ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          Server 1 (Stream HD)
        </button>

        <button
          onClick={() => setActiveServer('autoembed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeServer === 'autoembed'
              ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          Server 2 (Mirror)
        </button>

        {trailerEmbed && (
          <button
            onClick={() => setActiveServer('trailer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeServer === 'trailer'
                ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Official PV / Trailer
          </button>
        )}

        {streamData && (
          <button
            onClick={() => setActiveServer('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeServer === 'custom'
                ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            Custom HLS Player
          </button>
        )}
      </div>

      {/* Video Player Box */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#101018]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#F47521] animate-spin mx-auto" />
              <p className="text-gray-400 text-sm mt-3 font-medium">Preparing video stream...</p>
            </div>
          </div>
        ) : activeServer === 'custom' && streamData ? (
          <VideoPlayer
            sources={streamData.sources}
            subtitles={streamData.subtitles}
            poster={anime?.bannerImage || anime?.coverImage.extraLarge}
          />
        ) : activeServer === 'trailer' && trailerEmbed ? (
          <iframe
            src={trailerEmbed}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : activeServer === 'autoembed' ? (
          <iframe
            src={autoembedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <iframe
            src={vidsrcEmbed}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>

      {/* Episode Navigation */}
      <div className="flex items-center justify-between mt-5 gap-3">
        {prevEpisode ? (
          <Link
            href={`/watch/${encodeURIComponent(prevEpisode.id)}?anime=${animeId}&num=${prevEpisode.number}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white font-medium transition-colors border border-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Episode</span>
          </Link>
        ) : <div />}

        <div className="text-xs text-gray-500 font-medium">
          Episode {episodeNum} of {episodes.length || '?'}
        </div>

        {nextEpisode ? (
          <Link
            href={`/watch/${encodeURIComponent(nextEpisode.id)}?anime=${animeId}&num=${nextEpisode.number}`}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F47521] hover:bg-[#e06515] rounded-xl text-sm text-white font-semibold transition-colors shadow-lg shadow-[#F47521]/20"
          >
            <span>Next Episode</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>

      {/* All Episodes Grid */}
      {episodes.length > 0 && (
        <div className="mt-8 bg-[#141420] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#F47521]" />
              Episodes ({episodes.length})
            </h2>
            <span className="text-xs text-gray-400">Click any episode to play</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${encodeURIComponent(ep.id)}?anime=${animeId}&num=${ep.number}`}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                  String(ep.number) === String(episodeNum)
                    ? 'bg-[#F47521] text-white shadow-md shadow-[#F47521]/30 scale-105'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {ep.number}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#F47521] animate-spin" />
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
