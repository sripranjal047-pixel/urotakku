import { Episode, StreamData } from '@/types/anime';

// Fetches episodes using Jikan (MyAnimeList) API with fallback to episode count
export async function getAnimeEpisodes(animeId: string): Promise<Episode[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((ep: any) => ({
          id: `${animeId}-episode-${ep.mal_id}`,
          number: ep.mal_id,
          title: ep.title || `Episode ${ep.mal_id}`,
          description: null,
          image: null,
          isFiller: ep.filler || false,
        }));
      }
    }
  } catch (error) {
    console.warn('Jikan episodes list failed, falling back to full anime info:', error);
  }

  // Fallback: fetch anime full details to get total episode count
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    if (res.ok) {
      const json = await res.json();
      const count = json.data?.episodes || 12;
      return Array.from({ length: count }, (_, i) => ({
        id: `${animeId}-episode-${i + 1}`,
        number: i + 1,
        title: `Episode ${i + 1}`,
        description: null,
        image: null,
        isFiller: false,
      }));
    }
  } catch (err) {
    console.error('Failed to get episode count fallback:', err);
  }

  // Default fallback: 12 episodes
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${animeId}-episode-${i + 1}`,
    number: i + 1,
    title: `Episode ${i + 1}`,
    description: null,
    image: null,
    isFiller: false,
  }));
}

export async function getStreamSources(episodeId: string): Promise<StreamData | null> {
  return null;
}

export async function searchAnimeConsumet(query: string): Promise<Episode[]> {
  return [];
}
