'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import VideoPlayer from '@/components/player/VideoPlayer';
import { getStreamSources, getAnimeEpisodes } from '@/lib/consumet';
import { StreamData, Episode } from '@/types/anime';

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const episodeId = decodeURIComponent(params.episodeId as string);
  const animeId = searchParams.get('anime') || '';
  const episodeNum = searchParams.get('num') || '1';
  
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [stream, eps] = await Promise.all([
          getStreamSources(episodeId),
          animeId ? getAnimeEpisodes(animeId) : Promise.resolve([]),
        ]);

        if (stream && stream.sources.length > 0) {
          setStreamData(stream);
        } else {
          setError('No streaming sources found for this episode.');
        }
        setEpisodes(eps);
      } catch {
        setError('Failed to load episode. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [episodeId, animeId]);

  const currentEpIndex = episodes.findIndex(ep => ep.id === episodeId);
  const prevEpisode = currentEpIndex > 0 ? episodes[currentEpIndex - 1] : null;
  const nextEpisode = currentEpIndex < episodes.length - 1 ? episodes[currentEpIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      {animeId && (
        <Link
          href={`/anime/${animeId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#F47521] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to anime
        </Link>
      )}

      <h1 className="text-xl font-bold text-white mb-4">
        Episode {episodeNum}
      </h1>

      {/* Player */}
      {isLoading ? (
        <div className="w-full aspect-video bg-[#1a1a2e] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#F47521] animate-spin mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Loading episode...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full aspect-video bg-[#1a1a2e] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-lg">⚠️</p>
            <p className="text-gray-300 mt-2">{error}</p>
            <p className="text-gray-500 text-sm mt-1">The streaming source may be temporarily unavailable.</p>
          </div>
        </div>
      ) : streamData ? (
        <VideoPlayer
          sources={streamData.sources}
          subtitles={streamData.subtitles}
        />
      ) : null}

      {/* Episode navigation */}
      <div className="flex items-center justify-between mt-6">
        {prevEpisode ? (
          <Link
            href={`/watch/${encodeURIComponent(prevEpisode.id)}?anime=${animeId}&num=${prevEpisode.number}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Episode {prevEpisode.number}
          </Link>
        ) : <div />}

        {nextEpisode ? (
          <Link
            href={`/watch/${encodeURIComponent(nextEpisode.id)}?anime=${animeId}&num=${nextEpisode.number}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#F47521] hover:bg-[#e06515] rounded-xl text-sm text-white font-semibold transition-colors"
          >
            Episode {nextEpisode.number}
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>

      {/* Episode list */}
      {episodes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">All Episodes</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${encodeURIComponent(ep.id)}?anime=${animeId}&num=${ep.number}`}
                className={`p-2 text-center rounded-lg text-sm transition-colors ${
                  ep.id === episodeId
                    ? 'bg-[#F47521] text-white font-semibold'
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
