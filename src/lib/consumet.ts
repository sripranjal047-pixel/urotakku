import { Episode, StreamData } from '@/types/anime';

// Since we're in static export mode (no API routes), episodes are
// generated directly from AniList episode count data
export async function getAnimeEpisodes(animeId: string): Promise<Episode[]> {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query ($id: Int) { Media(id: $id, type: ANIME) { episodes status nextAiringEpisode { episode } } }`,
        variables: { id: parseInt(animeId) },
      }),
    });
    const data = await response.json();
    const media = data.data?.Media;
    const epCount = media?.episodes || 
      (media?.nextAiringEpisode?.episode ? media.nextAiringEpisode.episode - 1 : 0);

    return Array.from({ length: epCount || 0 }, (_, i) => ({
      id: `${animeId}-episode-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      description: null,
      image: null,
      isFiller: false,
    }));
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}

export async function getStreamSources(episodeId: string): Promise<StreamData | null> {
  // Streaming requires a Consumet API backend
  // For now, return null (no streaming source)
  console.log('Stream requested for:', episodeId);
  return null;
}

export async function searchAnimeConsumet(query: string): Promise<Episode[]> {
  // Search uses AniList directly via anilist.ts
  return [];
}
