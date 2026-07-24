/**
 * Build-time sitemap injector for CMS blog posts.
 *
 * Reads src/content/blogs.json, generates one <url> entry per PUBLISHED blog
 * (loc = <origin>/blog/<slug>, lastmod = updatedAt ?? publishedAt), and merges
 * them into public/sitemap.xml between the stable marker comments:
 *
 *   <!-- cms:blogs:start -->
 *   …generated entries…
 *   <!-- cms:blogs:end -->
 *
 * If the markers are missing the script falls back to inserting the entries
 * (wrapped in fresh markers) right before </urlset>. Behaves as a no-op when
 * there are zero published blogs. Run via `node scripts/build-sitemap.mjs`.
 *
 * Wired into package.json "build" so deploys regenerate the sitemap.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOGS_JSON = join(ROOT, 'src', 'content', 'blogs.json');
const SITEMAP_XML = join(ROOT, 'public', 'sitemap.xml');
const SITE_ORIGIN = 'https://www.meenakshigirish.com';

const START_MARKER = '<!-- cms:blogs:start -->';
const END_MARKER = '<!-- cms:blogs:end -->';

/** Normalise an ISO datetime to a sitemap-friendly YYYY-MM-DD date. */
function lastmod(value) {
  if (!value) return null;
  const date = value.includes('T') ? value.slice(0, 10) : value;
  return date;
}

async function main() {
  const raw = await readFile(BLOGS_JSON, 'utf8');
  const data = JSON.parse(raw);
  /** @type {Array<{slug: string, status: string, publishedAt: string, updatedAt?: string}>} */
  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];

  const entries = blogs
    .filter((b) => b && b.status === 'published' && typeof b.slug === 'string')
    .map((b) => {
      const mod = lastmod(b.updatedAt) ?? lastmod(b.publishedAt);
      const lastmodTag = mod ? `<lastmod>${mod}</lastmod>` : '';
      return `  <url><loc>${SITE_ORIGIN}/blog/${b.slug}</loc>${lastmodTag}</url>`;
    });

  const block = [START_MARKER, ...entries, END_MARKER].join('\n  ');

  const xml = await readFile(SITEMAP_XML, 'utf8');

  let next;
  const startIdx = xml.indexOf(START_MARKER);
  const endIdx = xml.indexOf(END_MARKER);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Replace whatever currently sits between the markers.
    next = xml.slice(0, startIdx) + block + xml.slice(endIdx + END_MARKER.length);
  } else {
    // Fallback: inject a fresh marked block before </urlset>.
    const closeIdx = xml.indexOf('</urlset>');
    if (closeIdx === -1) {
      throw new Error(`Could not find closing </urlset> or cms:blog markers in ${SITEMAP_XML}`);
    }
    next = xml.slice(0, closeIdx) + '  ' + block + '\n' + xml.slice(closeIdx);
  }

  await writeFile(SITEMAP_XML, next, 'utf8');
  console.log(`[build-sitemap] wrote ${entries.length} blog entr${entries.length === 1 ? 'y' : 'ies'} to public/sitemap.xml`);
}

main().catch((err) => {
  console.error('[build-sitemap] failed:', err);
  process.exit(1);
});
