export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
}

export function formatScore(score: number | null): string {
  if (!score) return 'N/A';
  return (score / 10).toFixed(1);
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    RELEASING: 'Airing',
    FINISHED: 'Completed',
    NOT_YET_RELEASED: 'Upcoming',
    CANCELLED: 'Cancelled',
    HIATUS: 'Hiatus',
  };
  return statusMap[status] || status;
}

export function formatSeason(season: string | null, year: number | null): string {
  if (!season || !year) return 'TBA';
  const seasonMap: Record<string, string> = {
    WINTER: 'Winter',
    SPRING: 'Spring',
    SUMMER: 'Summer',
    FALL: 'Fall',
  };
  return `${seasonMap[season] || season} ${year}`;
}

export function getDisplayTitle(title: { romaji: string; english: string | null }): string {
  return title.english || title.romaji;
}

export function generateAvatarColor(username: string): string {
  const colors = [
    '#F47521', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#00BCD4', '#009688',
    '#4CAF50', '#FF9800', '#FF5722', '#795548',
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
