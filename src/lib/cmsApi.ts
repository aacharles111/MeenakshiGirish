// src/lib/cmsApi.ts
// Typed client for the CMS endpoints (auth-gated; session cookie sent
// automatically via credentials:'same-origin'). Every method throws an Error
// on a non-ok response so callers can surface the server's message directly.
//
// All CMS content ops are served by ONE catch-all router (api/cms/[action].js)
// to stay under Vercel's per-deployment serverless-function limit:
//   GET  /api/cms/content          → { ok, blogs:{blogs:Blog[]}, gallery, testimonials, featured, settings }
//   POST /api/cms/blogs            { <blog> }              body IS the blog object
//   POST /api/cms/delete-blog      { id }
//   POST /api/cms/gallery          { images }
//   POST /api/cms/testimonials     { testimonials }
//   POST /api/cms/featured         { items }
//   POST /api/cms/settings         { <settings> }          body IS the settings object
//   POST /api/cms/upload           { filename, contentType, dataB64 } → { ok, url }
//
// `CmsContent.blogs` is exposed as a flat Blog[] (unwrapped from the server's
// `{blogs:Blog[]}` wrapper) so panel consumers deal with one canonical array.

import type {
  Blog,
  GalleryImage,
  Testimonial,
  FeaturedItem,
  SiteSettings,
} from './contentTypes'

export type CmsContent = {
  blogs: Blog[]
  gallery: { images: GalleryImage[] }
  testimonials: { testimonials: Testimonial[] }
  featured: { items: FeaturedItem[] }
  settings: SiteSettings
}

interface CmsContentResponse {
  ok?: boolean
  error?: string
  blogs?: { blogs?: Blog[] }
  gallery?: { images?: GalleryImage[] }
  testimonials?: { testimonials?: Testimonial[] }
  featured?: { items?: FeaturedItem[] }
  settings?: SiteSettings
}

interface PostResponse {
  ok?: boolean
  error?: string
  url?: string
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function postJSON<T extends PostResponse>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as T
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Request failed')
  }
  return data
}

/** Load all CMS content in one round-trip. Throws Error(serverError) on failure. */
export async function getContent(): Promise<CmsContent> {
  const res = await fetch('/api/cms/content', { credentials: 'same-origin' })
  const data = (await res.json().catch(() => ({}))) as CmsContentResponse
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Could not load content. Please try again.')
  }
  return {
    blogs: data.blogs?.blogs ?? [],
    gallery: { images: data.gallery?.images ?? [] },
    testimonials: { testimonials: data.testimonials?.testimonials ?? [] },
    featured: { items: data.featured?.items ?? [] },
    settings:
      data.settings ?? ({ book: {}, contact: {}, socials: [] } as unknown as SiteSettings),
  }
}

/** Upsert a single blog post (matched by id). Body is the blog object itself. */
export async function saveBlog(blog: Blog): Promise<void> {
  await postJSON('/api/cms/blogs', blog)
}

/** Idempotent delete of a single blog post by id. */
export async function deleteBlog(id: string): Promise<void> {
  await postJSON('/api/cms/delete-blog', { id })
}

/** Full-list replace for gallery images. */
export async function saveGallery(images: GalleryImage[]): Promise<void> {
  await postJSON('/api/cms/gallery', { images })
}

/** Full-list replace for testimonials. */
export async function saveTestimonials(list: Testimonial[]): Promise<void> {
  await postJSON('/api/cms/testimonials', { testimonials: list })
}

/** Full-list replace for featured-in links. */
export async function saveFeatured(items: FeaturedItem[]): Promise<void> {
  await postJSON('/api/cms/featured', { items })
}

/** Replace site settings (book / contact / socials). Body is the settings object itself. */
export async function saveSettings(settings: SiteSettings): Promise<void> {
  await postJSON('/api/cms/settings', settings)
}

/**
 * Upload an image via base64 JSON (NOT multipart). The File is read with
 * FileReader, the filename is slugified, and the server returns the public URL.
 * Returns the hosted image URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file)
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl)
  if (!match) throw new Error('Could not encode image for upload.')
  const [, detectedContentType, dataB64] = match
  const filename = slugifyFilename(file.name)
  const contentType = file.type || detectedContentType
  if (!filename) throw new Error('Image filename is empty after slugifying.')
  const data = await postJSON<{ url?: string }>('/api/cms/upload', {
    filename,
    contentType,
    dataB64,
  })
  if (!data?.url) throw new Error('Upload succeeded but no image URL was returned.')
  return data.url
}

/** lowercase · non-alnum → `-` · collapse · trim · slice(0,60) */
function slugifyFilename(name: string): string {
  const base = name.replace(/\.[^./\\]*$/, '')
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

const cmsApi = {
  getContent,
  saveBlog,
  deleteBlog,
  saveGallery,
  saveTestimonials,
  saveFeatured,
  saveSettings,
  uploadImage,
}

export default cmsApi
