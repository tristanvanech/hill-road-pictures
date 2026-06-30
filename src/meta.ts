// Meta Pixel (fbq) helper.
//
// The Pixel base code is loaded in index.html (pixel 238424817398252), so
// window.fbq is a global we call into. This file adds two things:
//   1. trackMeta()              — fire a single event from anywhere in code.
//   2. initMetaClickTracking()  — one listener that turns any element with a
//                                 `data-meta-event` attribute into a tracked
//                                 click. Add the attribute, get the event.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaParams = Record<string, string | number | boolean>;

// Names Meta recognizes as standard events get fbq('track', ...). Anything
// else is sent as a custom event via fbq('trackCustom', ...).
const STANDARD_EVENTS = new Set<string>([
  'Lead',
  'CompleteRegistration',
  'InitiateCheckout',
  'ViewContent',
  'Contact',
  'Schedule',
  'Purchase',
]);

/** Fire one Meta event. No-ops (and logs in dev) if the Pixel isn't loaded. */
export function trackMeta(eventName: string, params?: MetaParams): void {
  const fbq = window.fbq;
  if (typeof fbq !== 'function') {
    if (import.meta.env.DEV) {
      console.debug('[meta] fbq not ready, skipped:', eventName, params);
    }
    return;
  }
  const verb = STANDARD_EVENTS.has(eventName) ? 'track' : 'trackCustom';
  if (params && Object.keys(params).length > 0) fbq(verb, eventName, params);
  else fbq(verb, eventName);
}

// data-metaContentName -> content_name, etc.
function datasetKeyToParam(key: string): string {
  return key
    .slice(4) // drop the "meta" prefix
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
    .replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

/**
 * Attaches a single document-level click listener. When a click lands on (or
 * inside) any element carrying `data-meta-event`, the named event fires.
 *
 * Optional `data-meta-*` attributes ride along as event params, e.g.
 *   <button data-meta-event="ViewContent" data-meta-content-name="Deck">
 * sends ViewContent with { content_name: "Deck" }.
 *
 * Runs in the capture phase so it fires even if a handler later calls
 * stopPropagation, and resolves inner <span>/<svg> targets via closest().
 * One listener covers the whole app and survives SPA route changes.
 */
export function initMetaClickTracking(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener(
    'click',
    (event) => {
      const start = event.target as Element | null;
      const el = start?.closest<HTMLElement>('[data-meta-event]');
      if (!el) return;

      const eventName = el.dataset.metaEvent;
      if (!eventName) return;

      const params: MetaParams = {};
      for (const [key, value] of Object.entries(el.dataset)) {
        if (key === 'metaEvent' || value == null) continue;
        if (key.startsWith('meta')) params[datasetKeyToParam(key)] = value;
      }

      trackMeta(eventName, params);
    },
    true,
  );
}
