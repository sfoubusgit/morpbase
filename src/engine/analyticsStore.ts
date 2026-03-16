import { supabase } from './supabaseClient';

type AnalyticsEventInput = {
  eventType: 'session_start' | 'page_view' | string;
  pageKey?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown> | null;
  dedupeKey?: string | null;
};

const SESSION_STORAGE_KEY = 'morpbase:analytics_session_id';
const SESSION_STARTED_KEY = 'morpbase:analytics_started';
const ENABLED = import.meta.env.VITE_INTERNAL_ANALYTICS !== '0';

let memorySessionId: string | null = null;
let lastDedupeKey: string | null = null;

const buildSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `analytics_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const getSessionId = () => {
  if (typeof window === 'undefined') {
    if (!memorySessionId) {
      memorySessionId = buildSessionId();
    }
    return memorySessionId;
  }

  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const next = buildSessionId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    if (!memorySessionId) {
      memorySessionId = buildSessionId();
    }
    return memorySessionId;
  }
};

const getCurrentPath = () => {
  if (typeof window === 'undefined') return null;
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const getReferrerHost = () => {
  if (typeof document === 'undefined' || !document.referrer) return null;
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
};

export const trackAnalyticsEvent = async (input: AnalyticsEventInput): Promise<void> => {
  if (!ENABLED || typeof window === 'undefined') return;
  if (input.dedupeKey && input.dedupeKey === lastDedupeKey) return;

  const payload = {
    session_id: getSessionId(),
    user_id: input.userId ?? null,
    event_type: input.eventType,
    page_key: input.pageKey ?? null,
    path: getCurrentPath(),
    referrer_host: getReferrerHost(),
    metadata: input.metadata ?? null,
  };

  try {
    const { error } = await supabase.from('analytics_events').insert(payload);
    if (!error && input.dedupeKey) {
      lastDedupeKey = input.dedupeKey;
    }
  } catch {
    // Best-effort analytics only.
  }
};

export const trackAnalyticsSessionStart = async (input: {
  pageKey?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown> | null;
} = {}): Promise<void> => {
  if (!ENABLED || typeof window === 'undefined') return;

  try {
    const startedForSession = window.sessionStorage.getItem(SESSION_STARTED_KEY);
    if (startedForSession === '1') return;
  } catch {
    // ignore
  }

  await trackAnalyticsEvent({
    eventType: 'session_start',
    pageKey: input.pageKey ?? null,
    userId: input.userId ?? null,
    metadata: input.metadata ?? null,
    dedupeKey: `session_start:${getSessionId()}`,
  });

  try {
    window.sessionStorage.setItem(SESSION_STARTED_KEY, '1');
  } catch {
    // ignore
  }
};

export const trackAnalyticsPageView = async (input: {
  pageKey: string;
  userId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> => {
  await trackAnalyticsEvent({
    eventType: 'page_view',
    pageKey: input.pageKey,
    userId: input.userId ?? null,
    metadata: input.metadata ?? null,
    dedupeKey: `page_view:${input.pageKey}:${getCurrentPath()}`,
  });
};
