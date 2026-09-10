import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-white/10', className)} />
  );
}

// Card skeleton for anime cards
export function AnimeCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[180px]">
      <Skeleton className="w-full h-[255px] rounded-xl" />
      <Skeleton className="w-3/4 h-4 mt-2" />
      <Skeleton className="w-1/2 h-3 mt-1" />
    </div>
  );
}

// Hero banner skeleton
export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  );
}
