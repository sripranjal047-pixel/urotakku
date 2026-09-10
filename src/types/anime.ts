export interface Anime {
  id: string;
  anilistId: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    extraLarge: string;
  };
  bannerImage: string | null;
  description: string | null;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  format: string | null;
  studios: string[];
  nextAiringEpisode: {
    airingAt: number;
    episode: number;
  } | null;
  trailer: {
    id: string;
    site: string;
  } | null;
}

export interface Episode {
  id: string;
  number: number;
  title: string | null;
  description: string | null;
  image: string | null;
  isFiller: boolean;
}

export interface StreamSource {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface StreamData {
  headers: Record<string, string>;
  sources: StreamSource[];
  subtitles: Subtitle[];
  download: string | null;
}

export interface Subtitle {
  url: string;
  lang: string;
}

export interface SearchResult {
  id: string;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  format: string | null;
  episodes: number | null;
  averageScore: number | null;
  status: string;
  genres: string[];
}

export interface CommunityPost {
  id: string;
  animeId: string;
  username: string;
  message: string;
  timestamp: number;
  avatar: string;
}

export interface CommunityData {
  animeId: string;
  animeName: string;
  coverImage: string;
  memberCount: number;
  posts: CommunityPost[];
}

export interface WatchlistItem {
  id: string;
  title: string;
  coverImage: string;
  episodes: number | null;
  addedAt: number;
}
