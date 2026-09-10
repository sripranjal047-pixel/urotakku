import { Anime } from '@/types/anime';

const ANILIST_URL = 'https://graphql.anilist.co';

const ANIME_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    large
    extraLarge
  }
  bannerImage
  description(asHtml: false)
  episodes
  duration
  genres
  averageScore
  status
  season
  seasonYear
  format
  studios(isMain: true) {
    nodes {
      name
    }
  }
  nextAiringEpisode {
    airingAt
    episode
  }
  trailer {
    id
    site
  }
`;

async function fetchAniList(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  
  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'AniList API error');
  }
  return data.data;
}

function transformAnime(media: any): Anime {
  return {
    id: String(media.id),
    anilistId: media.id,
    title: {
      romaji: media.title?.romaji || '',
      english: media.title?.english || null,
      native: media.title?.native || null,
    },
    coverImage: {
      large: media.coverImage?.large || '',
      extraLarge: media.coverImage?.extraLarge || media.coverImage?.large || '',
    },
    bannerImage: media.bannerImage || null,
    description: media.description || null,
    episodes: media.episodes || null,
    duration: media.duration || null,
    genres: media.genres || [],
    averageScore: media.averageScore || null,
    status: media.status || 'UNKNOWN',
    season: media.season || null,
    seasonYear: media.seasonYear || null,
    format: media.format || null,
    studios: media.studios?.nodes?.map((s: any) => s.name) || [],
    nextAiringEpisode: media.nextAiringEpisode || null,
    trailer: media.trailer || null,
  };
}

export async function getTrending(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media.map(transformAnime);
}

export async function getPopular(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media.map(transformAnime);
}

export async function getTopRated(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media.map(transformAnime);
}

export async function getThisSeason(page = 1, perPage = 20): Promise<Anime[]> {
  const now = new Date();
  const month = now.getMonth();
  let season: string;
  if (month >= 0 && month <= 2) season = 'WINTER';
  else if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else season = 'FALL';
  const year = now.getFullYear();
  
  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, season: $season, seasonYear: $seasonYear, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage, season, seasonYear: year });
  return data.Page.media.map(transformAnime);
}

export async function searchAnime(searchQuery: string, page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME, isAdult: false, sort: SEARCH_MATCH) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const data = await fetchAniList(query, { search: searchQuery, page, perPage });
  return data.Page.media.map(transformAnime);
}

export async function getAnimeById(id: number): Promise<Anime> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${ANIME_FIELDS}
      }
    }
  `;
  const data = await fetchAniList(query, { id });
  return transformAnime(data.Media);
}
