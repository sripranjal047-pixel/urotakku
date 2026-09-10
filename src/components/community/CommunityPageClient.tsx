'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users, UserCircle } from 'lucide-react';
import { Anime, CommunityPost } from '@/types/anime';
import { useAppStore } from '@/lib/store';
import { getDisplayTitle, generateId } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import CommunityFeed from './CommunityFeed';
import ChatInput from './ChatInput';

interface CommunityPageClientProps {
  anime: Anime;
}

export default function CommunityPageClient({ anime }: CommunityPageClientProps) {
  const { username, setUsername, communities, addPost } = useAppStore();
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');

  const posts = communities[anime.id] || [];
  const displayTitle = getDisplayTitle(anime.title);

  useEffect(() => {
    if (!username) {
      setShowNamePrompt(true);
    }
  }, [username]);

  const handleSetName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
      setShowNamePrompt(false);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!username) {
      setShowNamePrompt(true);
      return;
    }

    const post: CommunityPost = {
      id: generateId(),
      animeId: anime.id,
      username,
      message,
      timestamp: Date.now(),
      avatar: '',
    };

    addPost(anime.id, post);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#F47521] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to communities
      </Link>

      {/* Anime banner */}
      <div className="relative h-40 rounded-xl overflow-hidden mb-6">
        <Image
          src={anime.bannerImage || anime.coverImage.extraLarge}
          alt={displayTitle}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="relative w-16 h-24 rounded-lg overflow-hidden border-2 border-[#0a0a0a]">
            <Image
              src={anime.coverImage.large}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{displayTitle}</h1>
            <div className="flex items-center gap-2 mt-1">
              {anime.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="orange">{genre}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Username bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{posts.length} messages</span>
        </div>
        {username && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UserCircle className="w-4 h-4" />
            <span>Chatting as <strong className="text-[#F47521]">{username}</strong></span>
            <button
              onClick={() => setShowNamePrompt(true)}
              className="text-xs text-gray-600 hover:text-white transition-colors"
            >
              (change)
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="bg-[#1a1a2e] rounded-xl overflow-hidden flex flex-col h-[500px]">
        <CommunityFeed posts={posts} />
        <ChatInput onSend={handleSendMessage} disabled={!username} />
      </div>

      {/* Username prompt modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => username && setShowNamePrompt(false)} />
          <div className="relative z-10 bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Choose a Username</h3>
            <p className="text-sm text-gray-400 mb-4">Pick a username to join the conversation.</p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              placeholder="Enter username..."
              maxLength={20}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#F47521]/50 mb-3"
              autoFocus
            />
            <button
              onClick={handleSetName}
              disabled={!tempName.trim()}
              className="w-full py-2.5 bg-[#F47521] hover:bg-[#e06515] disabled:opacity-50 rounded-xl text-white font-semibold transition-colors"
            >
              Join Community
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
