import { Anime } from '@/types/anime';

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const ANILIST_URL = 'https://graphql.anilist.co';

// Transform Jikan (MyAnimeList) API response to our unified Anime model
function transformJikanAnime(item: any): Anime {
  const images = item.images?.webp || item.images?.jpg;
  const largeCover = images?.large_image_url || images?.image_url || '';
  const maxCover = images?.maximum_image_url || largeCover;

  return {
    id: String(item.mal_id),
    anilistId: item.mal_id,
    title: {
      romaji: item.title || item.title_japanese || '',
      english: item.title_english || item.title || null,
      native: item.title_japanese || null,
    },
    coverImage: {
      large: largeCover,
      extraLarge: maxCover,
    },
    bannerImage: maxCover || largeCover || null,
    description: item.synopsis || null,
    episodes: item.episodes || null,
    duration: item.duration ? parseInt(item.duration, 10) || null : null,
    genres: (item.genres || []).map((g: any) => g.name),
    averageScore: item.score ? Math.round(item.score * 10) : null,
    status: item.airing ? 'RELEASING' : (item.status === 'Finished Airing' ? 'FINISHED' : 'NOT_YET_RELEASED'),
    season: item.season ? item.season.toUpperCase() : null,
    seasonYear: item.year || null,
    format: item.type || 'TV',
    studios: (item.studios || []).map((s: any) => s.name),
    nextAiringEpisode: null,
    trailer: item.trailer?.youtube_id ? {
      id: item.trailer.youtube_id,
      site: 'youtube',
    } : null,
  };
}

// Jikan fetch helper with timeout
async function fetchJikan(endpoint: string) {
  const response = await fetch(`${JIKAN_BASE}${endpoint}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status}`);
  }
  const json = await response.json();
  return json.data;
}

export async function getTrending(page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const data = await fetchJikan(`/top/anime?filter=airing&limit=${perPage}&page=${page}`);
    return (data || []).map(transformJikanAnime);
  } catch (error) {
    console.warn('Jikan trending failed, trying fallback:', error);
    return [];
  }
}

export async function getPopular(page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const data = await fetchJikan(`/top/anime?filter=bypopularity&limit=${perPage}&page=${page}`);
    return (data || []).map(transformJikanAnime);
  } catch (error) {
    console.warn('Jikan popular failed:', error);
    return [];
  }
}

export async function getTopRated(page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const data = await fetchJikan(`/top/anime?limit=${perPage}&page=${page}`);
    return (data || []).map(transformJikanAnime);
  } catch (error) {
    console.warn('Jikan top rated failed:', error);
    return [];
  }
}

export async function getThisSeason(page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const data = await fetchJikan(`/seasons/now?limit=${perPage}&page=${page}`);
    return (data || []).map(transformJikanAnime);
  } catch (error) {
    console.warn('Jikan season now failed, falling back to popular:', error);
    return getPopular(page, perPage);
  }
}

export async function searchAnime(searchQuery: string, page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const data = await fetchJikan(`/anime?q=${encodeURIComponent(searchQuery)}&limit=${perPage}&page=${page}&sfw=true`);
    return (data || []).map(transformJikanAnime);
  } catch (error) {
    console.warn('Jikan search failed:', error);
    return [];
  }
}

export async function getAnimeById(id: number): Promise<Anime> {
  try {
    const data = await fetchJikan(`/anime/${id}/full`);
    return transformJikanAnime(data);
  } catch (error) {
    console.error('Jikan getAnimeById failed:', error);
    throw error;
  }
}
