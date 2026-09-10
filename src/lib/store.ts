import { create } from 'zustand';
import { Anime, WatchlistItem, CommunityPost } from '@/types/anime';

interface AppState {
  // Modal state
  selectedAnime: Anime | null;
  isModalOpen: boolean;
  openModal: (anime: Anime) => void;
  closeModal: () => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;

  // Community
  communities: Record<string, CommunityPost[]>;
  addPost: (animeId: string, post: CommunityPost) => void;
  loadCommunities: () => void;

  // Username
  username: string;
  setUsername: (name: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Modal
  selectedAnime: null,
  isModalOpen: false,
  openModal: (anime) => set({ selectedAnime: anime, isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // Watchlist
  watchlist: [],
  addToWatchlist: (anime) => {
    const item: WatchlistItem = {
      id: anime.id,
      title: anime.title.english || anime.title.romaji,
      coverImage: anime.coverImage.large,
      episodes: anime.episodes,
      addedAt: Date.now(),
    };
    const updated = [...get().watchlist, item];
    set({ watchlist: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('urotaku-watchlist', JSON.stringify(updated));
    }
  },
  removeFromWatchlist: (id) => {
    const updated = get().watchlist.filter((item) => item.id !== id);
    set({ watchlist: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('urotaku-watchlist', JSON.stringify(updated));
    }
  },
  isInWatchlist: (id) => get().watchlist.some((item) => item.id === id),

  // Community
  communities: {},
  addPost: (animeId, post) => {
    const current = get().communities[animeId] || [];
    const updated = {
      ...get().communities,
      [animeId]: [...current, post],
    };
    set({ communities: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('urotaku-communities', JSON.stringify(updated));
    }
  },
  loadCommunities: () => {
    if (typeof window !== 'undefined') {
      try {
        const watchlist = JSON.parse(localStorage.getItem('urotaku-watchlist') || '[]');
        const communities = JSON.parse(localStorage.getItem('urotaku-communities') || '{}');
        const username = localStorage.getItem('urotaku-username') || '';
        set({ watchlist, communities, username });
      } catch {
        // ignore parse errors
      }
    }
  },

  // Username
  username: '',
  setUsername: (name) => {
    set({ username: name });
    if (typeof window !== 'undefined') {
      localStorage.setItem('urotaku-username', name);
    }
  },
}));
