'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/types/anime';
import { getDisplayTitle, stripHtml } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface HeroBannerProps {
  animeList: Anime[];
}

export default function HeroBanner({ animeList }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const openModal = useAppStore((state) => state.openModal);
  
  const featuredAnime = animeList.slice(0, 5).filter(a => a.bannerImage);
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
  }, [featuredAnime.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length);
  }, [featuredAnime.length]);

  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, [goToNext, featuredAnime.length]);

  if (featuredAnime.length === 0) return null;

  const anime = featuredAnime[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.bannerImage})` }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-16 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {anime.genres.slice(0, 4).map((genre) => (
                <Badge key={genre} variant="orange">{genre}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {getDisplayTitle(anime.title)}
            </h1>

            <p className="text-sm md:text-base text-gray-300 line-clamp-3 mb-6 max-w-lg">
              {stripHtml(anime.description)}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={`/anime/${anime.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-[#F47521] hover:bg-[#e06515] text-white font-semibold rounded-xl transition-colors"
              >
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </Link>
              <button
                onClick={() => openModal(anime)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
                Details
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {featuredAnime.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featuredAnime.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-[#F47521]'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
