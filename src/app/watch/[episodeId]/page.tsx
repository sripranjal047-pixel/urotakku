'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Loader2, ExternalLink, 
  Tv, Film, Sparkles, MonitorPlay, Mic, MessageSquare, 
  Maximize2, Share2, Search, Play, Star, Calendar, Clock, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getAnimeEpisodes } from '@/lib/consumet';
import { getAnimeById } from '@/lib/anilist';
import { Episode, Anime } from '@/types/anime';
import { getDisplayTitle, stripHtml, formatScore, formatSeason } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

type ServerOption = 'vidsrc-pm' | 'vidsrc-io' | 'embed-su' | 'trailer';
type AudioCategory = 'sub' | 'dub';

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const episodeId = decodeURIComponent(params.episodeId as string);
  const animeId = searchParams.get('anime') || '';
  const episodeNum = parseInt(searchParams.get('num') || '1', 10);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioMode, setAudioMode] = useState<AudioCategory>('sub');
  const [activeServer, setActiveServer] = useState<ServerOption>('vidsrc-pm');
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [selectedRange, setSelectedRange] = useState(0); // 0 = 1-100, 1 = 101-200, etc.

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [eps, animeData] = await Promise.all([
          animeId ? getAnimeEpisodes(animeId) : Promise.resolve([]),
          animeId ? getAnimeById(parseInt(animeId, 10)).catch(() => null) : Promise.resolve(null),
        ]);

        setEpisodes(eps);
        setAnime(animeData);
      } catch (error) {
        console.error('Failed to load anime or episodes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [animeId]);

  const animeTitle = anime ? getDisplayTitle(anime.title) : 'Anime';
  const crunchyrollUrl = `https://www.crunchyroll.com/search?q=${encodeURIComponent(animeTitle)}`;
  const hianimeUrl = `https://hianime.to/search?keyword=${encodeURIComponent(animeTitle)}`;

  // Navigation: prev / next episode
  const currentEpIndex = episodes.findIndex(ep => ep.number === episodeNum);
  const prevEpisode = currentEpIndex > 0 ? episodes[currentEpIndex - 1] : null;
  const nextEpisode = currentEpIndex >= 0 && currentEpIndex < episodes.length - 1 ? episodes[currentEpIndex + 1] : null;

  // Video embed URLs with SUB / DUB support
  const dubParam = audioMode === 'dub' ? '?dub=1' : '';
  const embedUrls: Record<ServerOption, string> = {
    'vidsrc-pm': `https://vidsrc.pm/embed/anime/${animeId}/${episodeNum}${dubParam}`,
    'vidsrc-io': `https://vidsrc.io/embed/anime/${animeId}/${episodeNum}${dubParam}`,
    'embed-su': `https://embed.su/embed/anime/${animeId}/${episodeNum}`,
    'trailer': anime?.trailer?.id 
      ? `https://www.youtube-nocookie.com/embed/${anime.trailer.id}?autoplay=1` 
      : '',
  };

  const currentEmbedUrl = embedUrls[activeServer] || embedUrls['vidsrc-pm'];

  // Handle pop-out theater window
  const openPopout = () => {
    if (currentEmbedUrl) {
      window.open(currentEmbedUrl, '_blank', 'width=1100,height=650,resizable=yes,scrollbars=no');
    }
  };

  // Group episodes into chunks of 100 like HiAnime
  const EPISODES_PER_CHUNK = 100;
  const episodeChunks = useMemo(() => {
    const total = episodes.length;
    if (total === 0) return [];
    const chunks = [];
    for (let i = 0; i < total; i += EPISODES_PER_CHUNK) {
      const start = i + 1;
      const end = Math.min(i + EPISODES_PER_CHUNK, total);
      chunks.push({ start, end, index: Math.floor(i / EPISODES_PER_CHUNK) });
    }
    return chunks;
  }, [episodes.length]);

  // Filter episodes based on chunk and search
  const displayedEpisodes = useMemo(() => {
    let list = episodes;
    if (episodeSearch.trim()) {
      const query = episodeSearch.trim().toLowerCase();
      return list.filter(ep => 
        String(ep.number).includes(query) || (ep.title && ep.title.toLowerCase().includes(query))
      );
    }
    if (episodeChunks.length > 1) {
      const chunk = episodeChunks[selectedRange];
      if (chunk) {
        list = list.filter(ep => ep.number >= chunk.start && ep.number <= chunk.end);
      }
    }
    return list;
  }, [episodes, episodeSearch, episodeChunks, selectedRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            {animeId && (
              <>
                <Link href={`/anime/${animeId}`} className="hover:text-[#F47521] transition-colors line-clamp-1 max-w-[200px]">
                  {animeTitle}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#F47521] font-semibold">Episode {episodeNum}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
            <span>{animeTitle}</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-[#F47521]/20 text-[#F47521] font-semibold border border-[#F47521]/30">
              EP {episodeNum}
            </span>
          </h1>
        </div>

        {/* Official & External Links */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={hianimeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold transition-colors border border-purple-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>HiAnime Mirror</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={crunchyrollUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F47521]/10 hover:bg-[#F47521]/20 text-[#F47521] text-xs font-semibold transition-colors border border-[#F47521]/20"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Crunchyroll</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Video Player + Servers */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Player Box */}
          <div className="relative w-full aspect-video bg-[#0d0d14] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e16]">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-[#F47521] animate-spin mx-auto" />
                  <p className="text-gray-400 text-sm mt-3 font-medium">Loading player...</p>
                </div>
              </div>
            ) : currentEmbedUrl ? (
              <iframe
                key={`${activeServer}-${audioMode}-${episodeNum}`}
                src={currentEmbedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#F47521] mb-2" />
                <p className="text-white font-semibold text-lg">Server is switching</p>
                <p className="text-gray-400 text-sm mt-1 max-w-md">
                  Please select another server from the options below.
                </p>
              </div>
            )}
          </div>

          {/* HiAnime-style Control & Server Bar */}
          <div className="bg-[#141420] p-4 rounded-2xl border border-white/5 space-y-4">
            {/* Top row: SUB/DUB toggle + Quick tools */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
              {/* SUB / DUB Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Audio:</span>
                <div className="bg-black/40 p-1 rounded-xl flex items-center gap-1 border border-white/5">
                  <button
                    onClick={() => setAudioMode('sub')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      audioMode === 'sub'
                        ? 'bg-[#F47521] text-white shadow-md shadow-[#F47521]/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    SUB
                  </button>
                  <button
                    onClick={() => setAudioMode('dub')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      audioMode === 'dub'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    DUB
                  </button>
                </div>

                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  {audioMode === 'sub' ? 'Original Japanese + Subtitles' : 'English Dubbed Audio'}
                </span>
              </div>

              {/* Action Buttons: Popout, Prev, Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={openPopout}
                  title="Open video in a clean pop-out theater window"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors border border-white/5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pop-out Player</span>
                </button>

                {prevEpisode && (
                  <Link
                    href={`/watch/${encodeURIComponent(prevEpisode.id)}?anime=${animeId}&num=${prevEpisode.number}`}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5"
                    title="Previous Episode"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}

                {nextEpisode && (
                  <Link
                    href={`/watch/${encodeURIComponent(nextEpisode.id)}?anime=${animeId}&num=${nextEpisode.number}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F47521] hover:bg-[#e06515] text-white text-xs font-semibold transition-colors shadow-md shadow-[#F47521]/20"
                    title="Next Episode"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom row: Server list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <MonitorPlay className="w-3.5 h-3.5 text-[#F47521]" />
                  Select Server (if current server buffers or refuses connection, click another):
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveServer('vidsrc-pm')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeServer === 'vidsrc-pm'
                      ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20 border border-[#F47521]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  HD-1 (VidSrc PM)
                  <span className="text-[10px] opacity-75 uppercase">({audioMode})</span>
                </button>

                <button
                  onClick={() => setActiveServer('vidsrc-io')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeServer === 'vidsrc-io'
                      ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20 border border-[#F47521]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  HD-2 (VidSrc IO)
                  <span className="text-[10px] opacity-75 uppercase">({audioMode})</span>
                </button>

                <button
                  onClick={() => setActiveServer('embed-su')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeServer === 'embed-su'
                      ? 'bg-[#F47521] text-white shadow-lg shadow-[#F47521]/20 border border-[#F47521]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  HD-3 (EmbedSU Mirror)
                </button>

                {anime?.trailer?.id && (
                  <button
                    onClick={() => setActiveServer('trailer')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeServer === 'trailer'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 border border-red-500'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5 text-red-400" />
                    Official PV / Trailer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Anime Info Card below player */}
          {anime && (
            <div className="bg-[#141420] p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-5">
              <img
                src={anime.coverImage.large}
                alt={animeTitle}
                className="w-24 h-36 object-cover rounded-xl shadow-lg flex-shrink-0 border border-white/10 hidden sm:block"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{animeTitle}</h2>
                  {anime.averageScore && (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {formatScore(anime.averageScore)}
                    </span>
                  )}
                  <Badge variant="orange">{anime.format || 'ANIME'}</Badge>
                  <Badge variant="green">{anime.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {anime.genres.map(g => (
                    <span key={g} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/5">
                      {g}
                    </span>
                  ))}
                </div>

                {anime.description && (
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">
                    {stripHtml(anime.description)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: HiAnime-style Episode List */}
        <div className="space-y-4">
          <div className="bg-[#141420] p-4 rounded-2xl border border-white/5 space-y-3">
            {/* Header + Search input */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-[#F47521]" />
                Episodes ({episodes.length})
              </h3>
            </div>

            {/* Quick search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                placeholder="Find episode number..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F47521]/50"
              />
            </div>

            {/* Range Selector if > 100 episodes */}
            {episodeChunks.length > 1 && !episodeSearch && (
              <div className="flex flex-wrap gap-1 pb-1">
                {episodeChunks.map((chunk) => (
                  <button
                    key={chunk.index}
                    onClick={() => setSelectedRange(chunk.index)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      selectedRange === chunk.index
                        ? 'bg-[#F47521] text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {chunk.start}-{chunk.end}
                  </button>
                ))}
              </div>
            )}

            {/* Episode Grid */}
            <div className="max-h-[520px] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
              {displayedEpisodes.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No episodes found.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-1.5">
                  {displayedEpisodes.map((ep) => {
                    const isActive = ep.number === episodeNum;
                    return (
                      <Link
                        key={ep.id}
                        href={`/watch/${encodeURIComponent(ep.id)}?anime=${animeId}&num=${ep.number}`}
                        className={`p-2 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                          isActive
                            ? 'bg-[#F47521] text-white shadow-md shadow-[#F47521]/30 scale-105 border border-[#F47521]'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{ep.number}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
