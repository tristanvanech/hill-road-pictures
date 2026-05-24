import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Navigate to an in-app route without a full page reload. */
export function navigate(to: string) {
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

/** Returns the current pathname and re-renders on browser back/forward. */
export function useRoute(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

// --- UTM attribution ---

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type UtmParams = Record<(typeof UTM_KEYS)[number], string>;

const UTM_STORAGE_KEY = 'hrp_utms';

const EMPTY_UTMS: UtmParams = {
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
};

/**
 * Reads UTM params from the current URL and persists them for the browser tab
 * session. Must run at app startup, before in-app navigation rewrites the URL
 * and drops its query string. A no-op when the URL carries no UTM params, so
 * earlier-captured values survive later UTM-free navigation.
 */
export function captureUtmParams(): void {
  const search = new URLSearchParams(window.location.search);
  const found: Partial<UtmParams> = {};
  let hasAny = false;
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) {
      found[key] = value;
      hasAny = true;
    }
  }
  if (!hasAny) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
  } catch {
    /* sessionStorage unavailable — skip */
  }
}

/** Returns the UTM params captured this session (empty strings if none). */
export function getUtmParams(): UtmParams {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (raw) {
      return { ...EMPTY_UTMS, ...(JSON.parse(raw) as Partial<UtmParams>) };
    }
  } catch {
    /* ignore malformed storage */
  }
  return { ...EMPTY_UTMS };
}
