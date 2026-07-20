import { test } from 'node:test';
import assert from 'node:assert';
import {
  validateBlog,
  validateGallery,
  validateTestimonials,
  validateFeatured,
  validateSettings,
  URL_RE,
  SLUG_RE,
} from '../../api/_cmsContent.js';

// ── Blog ───────────────────────────────────────────────────────────────────

test('validateBlog: valid input returns clean object with defaults filled', () => {
  const before = Date.now();
  const blog = validateBlog({
    title: 'My Post',
    slug: 'my-post',
    body: '<p>Hello</p>',
    status: 'draft',
  });
  const after = Date.now();
  assert.equal(blog.title, 'My Post');
  assert.equal(blog.slug, 'my-post');
  assert.equal(blog.body, '<p>Hello</p>');
  assert.equal(blog.status, 'draft');
  assert.equal(blog.author, 'Meenakshi Girish', 'default author');
  assert.equal(blog.banner, '', 'default banner');
  assert.equal(blog.bannerAlt, '', 'default bannerAlt');
  assert.equal(blog.publishedAt, '', 'draft has no publishedAt');
  assert.ok(blog.id && blog.id.length > 0, 'id generated');
  assert.ok(Date.parse(blog.updatedAt) >= before, 'updatedAt >= start');
  assert.ok(Date.parse(blog.updatedAt) <= after, 'updatedAt <= end');
});

test('validateBlog: keeps provided id', () => {
  const blog = validateBlog({ id: 'abc-123', title: 'T', slug: 't', body: 'b', status: 'draft' });
  assert.equal(blog.id, 'abc-123');
});

test('validateBlog: missing title throws', () => {
  assert.throws(
    () => validateBlog({ slug: 'x', body: 'y', status: 'draft' }),
    /Title/,
  );
});

test('validateBlog: invalid status throws', () => {
  assert.throws(
    () => validateBlog({ title: 'T', slug: 't', body: 'b', status: 'live' }),
    /Status/,
  );
});

test('validateBlog: slug with uppercase/space throws', () => {
  assert.throws(
    () => validateBlog({ title: 'T', slug: 'Bad Slug', body: 'b', status: 'draft' }),
    /Slug/,
  );
});

test('validateBlog: <script> block stripped from body', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', status: 'draft',
    body: '<p>hi</p><script>alert(1)</script><p>bye</p>',
  });
  assert.equal(blog.body, '<p>hi</p><p>bye</p>');
  assert.ok(!/<script/i.test(blog.body), 'no script tag remains');
});

test('validateBlog: <script> with attrs and multiline also stripped', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', status: 'draft',
    body: '<p>x</p><script src="evil.js">\nvar x = 1;\n</script><p>y</p>',
  });
  assert.ok(!/<script/i.test(blog.body));
  assert.ok(blog.body.includes('<p>x</p>'));
  assert.ok(blog.body.includes('<p>y</p>'));
});

test('validateBlog: angle brackets stripped from plain-text fields', () => {
  const blog = validateBlog({ title: '<b>Hi</b>', slug: 't', body: 'b', status: 'draft' });
  assert.equal(blog.title, 'bHi/b', '< and > removed, inner text kept');
});

test('validateBlog: non-unique slug (different id) throws', () => {
  const existing = [{ id: 'other-id', slug: 'taken' }];
  assert.throws(
    () => validateBlog(
      { id: 'new-id', title: 'T', slug: 'taken', body: 'b', status: 'draft' },
      existing,
    ),
    /Slug already in use/,
  );
});

test('validateBlog: same id + same slug allowed (update path)', () => {
  const existing = [{ id: 'same-id', slug: 'my-slug' }];
  const blog = validateBlog(
    { id: 'same-id', title: 'T', slug: 'my-slug', body: 'b', status: 'draft' },
    existing,
  );
  assert.equal(blog.id, 'same-id');
  assert.equal(blog.slug, 'my-slug');
});

test('validateBlog: published sets publishedAt to now when missing', () => {
  const before = Date.now();
  const blog = validateBlog({ title: 'T', slug: 't', body: 'b', status: 'published' });
  assert.ok(Date.parse(blog.publishedAt) >= before, 'publishedAt is now-ish');
});

test('validateBlog: published preserves an explicit publishedAt', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', body: 'b', status: 'published',
    publishedAt: '2024-01-15T10:00:00.000Z',
  });
  assert.equal(blog.publishedAt, '2024-01-15T10:00:00.000Z');
});

test('validateBlog: empty body throws', () => {
  assert.throws(
    () => validateBlog({ title: 'T', slug: 't', body: '   ', status: 'draft' }),
    /Body/,
  );
});

// ── Gallery ────────────────────────────────────────────────────────────────

test('validateGallery: valid passes, alt defaults to empty string', () => {
  const g = validateGallery({ images: [{ src: '/a.jpg', alt: 'A' }, { src: '/b.jpg' }] });
  assert.equal(g.images.length, 2);
  assert.equal(g.images[0].src, '/a.jpg');
  assert.equal(g.images[0].alt, 'A');
  assert.equal(g.images[1].alt, '', 'alt defaults to empty');
});

test('validateGallery: empty src throws', () => {
  assert.throws(
    () => validateGallery({ images: [{ src: '', alt: 'A' }] }),
    /src/,
  );
});

test('validateGallery: over 500 images throws', () => {
  const images = Array.from({ length: 501 }, () => ({ src: '/x.jpg' }));
  assert.throws(
    () => validateGallery({ images }),
    /500/,
  );
});

// ── Testimonials ───────────────────────────────────────────────────────────

test('validateTestimonials: valid passes, role defaults to empty', () => {
  const t = validateTestimonials({ testimonials: [{ quote: 'Great', author: 'A' }] });
  assert.equal(t.testimonials[0].quote, 'Great');
  assert.equal(t.testimonials[0].author, 'A');
  assert.equal(t.testimonials[0].role, '');
  assert.ok(t.testimonials[0].id, 'id generated');
});

test('validateTestimonials: missing quote throws', () => {
  assert.throws(
    () => validateTestimonials({ testimonials: [{ author: 'A' }] }),
    /quote/i,
  );
});

// ── Featured ───────────────────────────────────────────────────────────────

test('validateFeatured: accepts hash URL placeholder', () => {
  const f = validateFeatured({ items: [{ label: 'Forbes', url: '#' }] });
  assert.equal(f.items[0].url, '#');
});

test('validateFeatured: rejects javascript: URL', () => {
  assert.throws(
    () => validateFeatured({ items: [{ label: 'X', url: 'javascript:alert(1)' }] }),
    /URL/,
  );
});

test('validateFeatured: empty label throws', () => {
  assert.throws(
    () => validateFeatured({ items: [{ label: '', url: '#' }] }),
    /label/i,
  );
});

// ── Settings ───────────────────────────────────────────────────────────────

const validSettings = {
  book: { priceInr: 499, title: 'Book', buyCtaLabel: 'Buy Now' },
  contact: { email: 'meena@example.com' },
  socials: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/x', icon: 'linkedin' }],
};

test('validateSettings: valid passes through cleanly', () => {
  const s = validateSettings(validSettings);
  assert.equal(s.book.priceInr, 499);
  assert.equal(s.book.title, 'Book');
  assert.equal(s.book.buyCtaLabel, 'Buy Now');
  assert.equal(s.contact.email, 'meena@example.com');
  assert.equal(s.socials[0].icon, 'linkedin');
});

test('validateSettings: price < 1 throws', () => {
  assert.throws(
    () => validateSettings({ ...validSettings, book: { ...validSettings.book, priceInr: 0 } }),
    /Price/,
  );
});

test('validateSettings: non-integer price throws', () => {
  assert.throws(
    () => validateSettings({ ...validSettings, book: { ...validSettings.book, priceInr: 4.5 } }),
    /Price/,
  );
});

test('validateSettings: non-numeric price throws', () => {
  assert.throws(
    () => validateSettings({ ...validSettings, book: { ...validSettings.book, priceInr: 'free' } }),
    /Price/,
  );
});

test('validateSettings: bad email throws', () => {
  assert.throws(
    () => validateSettings({ ...validSettings, contact: { email: 'not-an-email' } }),
    /email/i,
  );
});

test('validateSettings: invalid icon throws', () => {
  assert.throws(
    () => validateSettings({
      ...validSettings,
      socials: [{ label: 'TikTok', url: 'https://tiktok.com/@x', icon: 'tiktok' }],
    }),
    /icon/i,
  );
});

test('validateSettings: social with javascript URL throws', () => {
  assert.throws(
    () => validateSettings({
      ...validSettings,
      socials: [{ label: 'X', url: 'javascript:alert(1)', icon: 'linkedin' }],
    }),
    /URL/,
  );
});

// ── Shared regexes ─────────────────────────────────────────────────────────

test('URL_RE: rejects data: scheme', () => {
  assert.equal(URL_RE.test('data:text/html,<script>alert(1)</script>'), false);
});

test('URL_RE: accepts http and https', () => {
  assert.ok(URL_RE.test('http://example.com'));
  assert.ok(URL_RE.test('https://example.com/path?q=1'));
});

test('SLUG_RE: validates slug shape', () => {
  assert.ok(SLUG_RE.test('my-post-2024'));
  assert.equal(SLUG_RE.test('My Post'), false);
  assert.equal(SLUG_RE.test('up_per'), false);
  assert.equal(SLUG_RE.test('spaces not'), false);
});

// ── Security hardening ─────────────────────────────────────────────────────

test('sanitizeBodyHtml: <img onerror> event handler stripped', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', status: 'draft',
    body: '<img src="x" onerror="alert(1)">',
  });
  assert.ok(!blog.body.includes('onerror'), 'no onerror in result');
  assert.ok(!/<img[^>]*on\w+/i.test(blog.body), 'no inline handler on img');
});

test('sanitizeBodyHtml: <iframe> block stripped', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', status: 'draft',
    body: '<p>ok</p><iframe src="evil"></iframe><p>end</p>',
  });
  assert.ok(!blog.body.includes('<iframe'), 'no iframe tag in result');
  assert.ok(!blog.body.includes('evil'), 'iframe content dropped');
  assert.ok(blog.body.includes('<p>ok</p>'));
});

test('sanitizeBodyHtml: javascript: URL in href neutralized', () => {
  const blog = validateBlog({
    title: 'T', slug: 't', status: 'draft',
    body: '<a href="javascript:alert(1)">x</a>',
  });
  assert.ok(!blog.body.toLowerCase().includes('javascript:'), 'no javascript: scheme');
});

test('cleanUrl rejects URLs containing a quote (Fix 2)', () => {
  assert.throws(
    () => validateFeatured({ items: [{ label: 'X', url: 'https://x"y' }] }),
    /URL/,
  );
  assert.throws(
    () => validateSettings({
      ...validSettings,
      socials: [{ label: 'X', url: "https://x'y", icon: 'linkedin' }],
    }),
    /URL/,
  );
});

test('validateBlog: non-ISO publishedAt throws (Fix 3)', () => {
  assert.throws(
    () => validateBlog({
      title: 'T', slug: 't', body: 'b', status: 'draft',
      publishedAt: 'not-a-date',
    }),
    /ISO 8601/,
  );
});

test('validateBlog: published + unset publishedAt defaults to a valid ISO string', () => {
  const blog = validateBlog({ title: 'T', slug: 't', body: 'b', status: 'published' });
  assert.ok(blog.publishedAt, 'publishedAt is set');
  assert.match(
    blog.publishedAt,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
    'default publishedAt matches ISO 8601',
  );
});
