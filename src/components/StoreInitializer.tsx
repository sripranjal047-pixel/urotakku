'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function StoreInitializer() {
  const loadCommunities = useAppStore((state) => state.loadCommunities);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  return null;
}
