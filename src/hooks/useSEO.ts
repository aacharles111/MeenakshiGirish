import { useEffect } from 'react';

interface SEOOptions {
  /** Full page <title> (ideally ≤60 chars). */
  title: string;
  /** Meta description (ideally 120–160 chars). */
  description: string;
  /** Page path for canonical + og:url, e.g. "/freelancing". Leave undefined for the homepage. */
  path?: string;
  /** Image URL for og:image / JSON-LD image. Root-relative paths are absolutised. */
  image?: string;
  /** Open Graph object type. Use 'article' on blog posts to also emit a BlogPosting JSON-LD block. */
  type?: 'article' | 'website';
  /** ISO date the article was published (feeds article:published_time + JSON-LD datePublished). */
  publishedTime?: string;
  /** Article author name (feeds article:author + JSON-LD author). */
  author?: string;
}

const SITE_ORIGIN = 'https://www.meenakshigirish.com';
/** Site-wide og:image used as the fallback when a route doesn't supply its own.
 * Mirrors the static tag in index.html so non-article routes keep their existing
 * og:image even after SPA-navigating away from an article. */
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.webp`;
/** id on the BlogPosting JSON-LD <script> so we can find/update/remove just ours. */
const JSONLD_ID = 'seo-jsonld-blogposting';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

/** Absolutise a root-relative or protocol-relative image URL for og:image / JSON-LD. */
function absoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`;
}

/**
 * Lightweight client-side SEO: sets a unique <title>, meta description, og tags
 * and canonical per route. The static fallback lives in index.html; this refines
 * it once the SPA mounts (covers Google's JS rendering + browser tab titles).
 *
 * The optional `image`, `type`, `publishedTime` and `author` fields add
 * article-level og:* tags and, when `type === 'article'`, a BlogPosting JSON-LD
 * block. Callers that only pass title/description/path are unaffected: og:image
 * and og:type are reset to the site defaults (matching index.html) and the
 * article-exclusive tags + JSON-LD are removed, so no article metadata ever
 * leaks onto a non-article route.
 */
export default function useSEO({
  title,
  description,
  path,
  image,
  type,
  publishedTime,
  author,
}: SEOOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    const url = path ? `${SITE_ORIGIN}${path}` : `${SITE_ORIGIN}/`;
    upsertMeta('property', 'og:url', url);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    // og:image — use the supplied image on articles, otherwise restore the site
    // default so a previous article's banner doesn't bleed onto other pages.
    upsertMeta('property', 'og:image', image ? absoluteUrl(image) : DEFAULT_OG_IMAGE);
    // og:type — 'article' on blog posts, 'website' everywhere else.
    upsertMeta('property', 'og:type', type ?? 'website');

    // article:* tags are article-exclusive (no static default in index.html) —
    // emit when supplied, remove otherwise.
    if (author) upsertMeta('property', 'article:author', author);
    else removeMeta('property', 'article:author');
    if (publishedTime) upsertMeta('property', 'article:published_time', publishedTime);
    else removeMeta('property', 'article:published_time');

    // BlogPosting JSON-LD — only on article pages. On any other route, remove
    // a leftover block from a previous article so it can't leak.
    const existing = document.getElementById(JSONLD_ID);
    if (type === 'article') {
      const jsonld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      };
      if (image) jsonld.image = [absoluteUrl(image)];
      if (publishedTime) jsonld.datePublished = publishedTime;
      if (author) jsonld.author = { '@type': 'Person', name: author };

      const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
      script.id = JSONLD_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonld);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }

    return () => {
      // Tear down our JSON-LD when leaving an article route so it can't linger.
      document.getElementById(JSONLD_ID)?.remove();
    };
  }, [title, description, path, image, type, publishedTime, author]);
}
