'use client';

import { Anime } from '@/types/anime';
import { useAppStore } from '@/lib/store';
import CommunityCard from './CommunityCard';

interface CommunityHubClientProps {
  animeList: Anime[];
}

export default function CommunityHubClient({ animeList }: CommunityHubClientProps) {
  const communities = useAppStore((state) => state.communities);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {animeList.map((anime) => (
        <CommunityCard
          key={anime.id}
          anime={anime}
          postCount={communities[anime.id]?.length || 0}
        />
      ))}
    </div>
  );
}
