'use client';

import { useRef, useEffect } from 'react';
import { CommunityPost } from '@/types/anime';
import { timeAgo, generateAvatarColor } from '@/lib/utils';

interface CommunityFeedProps {
  posts: CommunityPost[];
}

export default function CommunityFeed({ posts }: CommunityFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No messages yet</p>
          <p className="text-gray-600 text-sm mt-1">Be the first to start a discussion!</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={feedRef} className="flex-1 overflow-y-auto space-y-4 p-4">
      {posts.map((post) => {
        const avatarColor = generateAvatarColor(post.username);
        return (
          <div key={post.id} className="flex gap-3 group">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {post.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-white">{post.username}</span>
                <span className="text-xs text-gray-600">{timeAgo(post.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-300 mt-0.5 break-words">{post.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
