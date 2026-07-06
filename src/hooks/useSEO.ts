import { useEffect } from 'react';

interface SEOOptions {
  /** Full page <title> (ideally ≤60 chars). */
  title: string;
  /** Meta description (ideally 120–160 chars). */
  description: string;
  /** Page path for canonical + og:url, e.g. "/freelancing". Leave undefined for the homepage. */
  path?: string;
}

const SITE_ORIGIN = 'https://www.meenakshigirish.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Lightweight client-side SEO: sets a unique <title>, meta description, og tags
 * and canonical per route. The static fallback lives in index.html; this refines
 * it once the SPA mounts (covers Google's JS rendering + browser tab titles).
 */
export default function useSEO({ title, description, path }: SEOOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    const url = path ? `${SITE_ORIGIN}${path}` : `${SITE_ORIGIN}/`;
    upsertMeta('property', 'og:url', url);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [title, description, path]);
}
