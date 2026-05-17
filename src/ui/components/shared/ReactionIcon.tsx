export type ReactionKey = 'thumbs_up' | 'heart' | 'laugh' | 'sad';

const LABELS: Record<ReactionKey, string> = {
  thumbs_up: 'Like',
  heart:     'Love',
  laugh:     'Funny',
  sad:       'Sad',
};

export function reactionLabel(key: string): string {
  return LABELS[key as ReactionKey] ?? key;
}

export function ReactionIcon({ type, size = 16 }: { type: string; size?: number }) {
  const svg = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type as ReactionKey) {
    case 'thumbs_up':
      return (
        <svg {...svg}>
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...svg}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
    case 'laugh':
      return (
        <svg {...svg}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01M15 9h.01" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      );
    case 'sad':
      return (
        <svg {...svg}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <path d="M9 9h.01M15 9h.01" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
