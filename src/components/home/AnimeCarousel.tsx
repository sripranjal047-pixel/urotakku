'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';
import { AnimeCardSkeleton } from '@/components/ui/Skeleton';

interface AnimeCarouselProps {
  title: string;
  emoji?: string;
  animeList: Anime[];
  isLoading?: boolean;
}

export default function AnimeCarousel({ title, emoji, animeList, isLoading }: AnimeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 600;
    const newPosition = direction === 'left'
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className="relative">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 px-4 sm:px-0">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h2>

      <div className="relative group">
        {/* Left arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent flex items-center justify-start pl-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <AnimeCardSkeleton key={i} />)
            : animeList.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
          }
        </div>

        {/* Right arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </section>
  );
}
