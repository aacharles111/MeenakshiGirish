// src/components/admin/BlogsPanel.tsx
// Blog CRUD: list (title, status badge, date) + in-place editor drawer.
// All saves flow through AdminLayout's SaveContext so the shared
// Saving→Committed→Building→Live toast stays consistent. The shell invokes
// `onSaved` itself after the save callback resolves, so this panel never
// calls it directly (that would double-fire the reload).

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Eye,
  ImagePlus,
  Loader2,
  PenLine,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Upload,
} from 'lucide-react'
import type { Blog } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'
import TipTapEditor from './TipTapEditor'

interface BlogsPanelProps {
  blogs: Blog[]
  // AdminLayout's `runSave` already invokes `onSaved` itself after the save
  // callback resolves, so we accept the prop for API symmetry but never call
  // it from inside `runSave` (that would double-fire the reload).
  onSaved: () => void
}

// ── Field caps (also used as maxLength for hard enforcement) ──
const MAX_META_TITLE = 60
const MAX_META_DESC = 160
const MAX_EXCERPT = 200
const DEFAULT_AUTHOR = 'Meenakshi Girish'

/**
 * slugify — lowercase · trim · non-alnum → `-` · collapse repeats · strip
 * leading/trailing `-`. Empty string if there's nothing slugifiable.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyBlog(): Blog {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    metaTitle: '',
    metaDescription: '',
    excerpt: '',
    banner: '',
    bannerAlt: '',
    body: '',
    status: 'draft',
    publishedAt: '',
    updatedAt: now,
    author: DEFAULT_AUTHOR,
  }
}

/** Body is "empty" if it has no text content once tags strip out. */
function isBodyEmpty(html: string): boolean {
  return html.replace(/<[^>]+>/g, '').trim().length === 0
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogsPanel({ blogs }: BlogsPanelProps) {
  const { runSave, status } = useCmsSave()
  const saving = status.state === 'saving'
  const serverError = status.state === 'error' ? status.message : null

  // null draft = list view; non-null = editor view.
  const [draft, setDraft] = useState<Blog | null>(null)
  const [isNew, setIsNew] = useState(false)
  // Has the user manually edited the slug? Until they do, slug tracks title.
  const [slugTouched, setSlugTouched] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // ── List ordering: published first (by publishedAt desc), then drafts (updatedAt desc) ──
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      if (a.status === 'published' && b.status === 'published') {
        return (b.publishedAt || '').localeCompare(a.publishedAt || '')
      }
      if (a.status === 'published') return -1
      if (b.status === 'published') return 1
      return (b.updatedAt || '').localeCompare(a.updatedAt || '')
    })
  }, [blogs])

  // ── Navigation ──
  const handleNew = () => {
    setDraft(emptyBlog())
    setIsNew(true)
    setSlugTouched(false)
    setBannerError(null)
  }

  const handleEdit = (blog: Blog) => {
    setDraft({ ...blog })
    setIsNew(false)
    setSlugTouched(Boolean(blog.slug))
    setBannerError(null)
  }

  const handleBack = () => {
    setDraft(null)
    setIsNew(false)
    setSlugTouched(false)
    setBannerError(null)
  }

  const handleDeleteFromList = async (blog: Blog) => {
    const label = blog.title.trim() || blog.slug || 'this post'
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return
    await runSave(async () => {
      await cmsApi.deleteBlog(blog.id)
    })
  }

  const handleDeleteFromEditor = async () => {
    if (!draft) return
    const label = draft.title.trim() || draft.slug || 'this post'
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return
    const id = draft.id
    await runSave(async () => {
      await cmsApi.deleteBlog(id)
    })
    handleBack()
  }

  // ── Field edits ──
  const updateField = <K extends keyof Blog>(key: K, value: Blog[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const updateTitle = (title: string) => {
    setDraft((prev) => {
      if (!prev) return prev
      const next: Blog = { ...prev, title }
      if (!slugTouched) next.slug = slugify(title)
      return next
    })
  }

  const updateSlug = (slug: string) => {
    if (!slugTouched) setSlugTouched(true)
    updateField('slug', slug)
  }

  const updateBody = (body: string) => updateField('body', body)

  const handleBannerClick = () => {
    setBannerError(null)
    bannerInputRef.current?.click()
  }

  const handleBannerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (bannerInputRef.current) bannerInputRef.current.value = ''
    if (!file || !draft) return
    setBannerError(null)
    setBannerUploading(true)
    try {
      const url = await cmsApi.uploadImage(file)
      updateField('banner', url)
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBannerUploading(false)
    }
  }

  // ── Save actions ──
  const buildBlogForSave = (targetStatus: 'draft' | 'published'): Blog => {
    if (!draft) throw new Error('No draft in flight')
    const now = new Date().toISOString()
    const publishedAt =
      targetStatus === 'published'
        ? draft.publishedAt || now // stamp on first publish, keep on re-save
        : draft.publishedAt // keep when unpublishing / saving as draft
    return {
      ...draft,
      slug: slugify(draft.slug) || slugify(draft.title), // normalize on save
      status: targetStatus,
      publishedAt,
      updatedAt: now,
    }
  }

  const persist = async (blog: Blog) => {
    await runSave(async () => {
      await cmsApi.saveBlog(blog)
    })
    // Reflect saved blog into local draft so updatedAt / status stick.
    setDraft(blog)
    setIsNew(false)
  }

  const canSave =
    !!draft &&
    draft.title.trim().length > 0 &&
    !isBodyEmpty(draft.body) &&
    !bannerUploading &&
    !saving

  const handleSaveDraft = async () => {
    if (!canSave) return
    await persist(buildBlogForSave('draft'))
  }

  const handlePublish = async () => {
    if (!canSave) return
    await persist(buildBlogForSave('published'))
  }

  const handleUnpublish = async () => {
    if (!draft || saving) return
    await persist(buildBlogForSave('draft'))
  }

  // ── Render: list ──
  if (!draft) {
    return (
      <section className="space-y-6">
        <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
                Journal · Posts
              </p>
              <h2
                className="font-bold italic text-foreground"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
              >
                Blog Posts
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}. Drafts
                stay hidden; published posts appear on the public journal.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNew}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Plus size={14} />
              New post
            </button>
          </div>
          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 flex items-start gap-2"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
        </div>

        {sortedBlogs.length === 0 ? (
          <div className="bg-card rounded-[2rem] p-10 md:p-14 border border-dashed border-border text-center">
            <PenLine size={28} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">No posts yet</p>
            <p className="text-sm text-muted-foreground mb-5">
              Start a draft to see it come together here.
            </p>
            <button
              type="button"
              onClick={handleNew}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] transition-all duration-200"
            >
              <Plus size={14} />
              New post
            </button>
          </div>
        ) : (
          <ul className="bg-card rounded-[2rem] border border-border/50 overflow-hidden divide-y divide-border/60">
            {sortedBlogs.map((blog) => {
              const published = blog.status === 'published'
              return (
                <li
                  key={blog.id}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-semibold text-foreground truncate"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {blog.title.trim() || 'Untitled post'}
                      </h3>
                      <StatusBadge status={blog.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      /{blog.slug || 'no-slug'} ·{' '}
                      {published
                        ? `Published ${formatDate(blog.publishedAt)}`
                        : `Updated ${formatDate(blog.updatedAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 border-2 border-primary text-primary font-semibold text-[0.7rem] uppercase tracking-wide rounded-full px-3.5 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50"
                    >
                      <PenLine size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFromList(blog)}
                      disabled={saving}
                      aria-label={`Delete ${blog.title || 'post'}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    )
  }

  // ── Render: editor ──
  const slugCollision = blogs.some(
    (b) => b.id !== draft.id && b.slug === draft.slug.trim(),
  )
  const published = draft.status === 'published'
  const persisted = blogs.some((b) => b.id === draft.id)

  return (
    <section className="space-y-6">
      {/* Hidden banner upload input */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Header / actions */}
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft size={13} />
              All posts
            </button>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              {isNew ? 'New draft' : published ? 'Published post' : 'Draft'}
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              {draft.title.trim() || 'Untitled post'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {published
                ? `Published ${formatDate(draft.publishedAt)}`
                : `Updated ${formatDate(draft.updatedAt)}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {published ? (
              <>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canSave}
                  className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <ArrowLeft size={14} />
                  Unpublish
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={!canSave}
                  className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canSave}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <Send size={14} />
                  Publish
                </button>
              </>
            )}
            {persisted && (
              <button
                type="button"
                onClick={handleDeleteFromEditor}
                disabled={saving}
                aria-label="Delete post"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        {serverError && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 flex items-start gap-2"
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title (the H1) */}
          <FieldShell label="Title" hint="The post H1 — shows on the public blog page.">
            <input
              type="text"
              value={draft.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="A title that earns the click"
              className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-base font-semibold text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              style={{ fontFamily: 'var(--font-playfair)' }}
            />
          </FieldShell>

          {/* Slug */}
          <FieldShell
            label="Slug"
            hint={
              slugCollision
                ? undefined
                : 'Auto-derived from the title — edit if you want a custom URL.'
            }
          >
            <div className="flex items-stretch">
              <span className="inline-flex items-center bg-muted border border-r-0 border-border rounded-l-lg px-3 text-sm text-muted-foreground">
                /blog/
              </span>
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => updateSlug(e.target.value)}
                placeholder="url-friendly-slug"
                className="flex-1 min-w-0 bg-input border border-border rounded-r-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            {slugCollision && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                Another post already uses this slug — pick a unique one.
              </p>
            )}
          </FieldShell>

          {/* Body */}
          <FieldShell label="Body" hint="Rich text — H2/H3 for sub-headings (no H1).">
            <TipTapEditor
              value={draft.body}
              onChange={updateBody}
              disabled={saving}
            />
          </FieldShell>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Status */}
          <FieldShell label="Status">
            <div className="flex items-center gap-2">
              <StatusBadge status={draft.status} />
              <span className="text-xs text-muted-foreground">
                {published
                  ? 'Live on the public site'
                  : 'Hidden from readers'}
              </span>
            </div>
            {published && draft.publishedAt && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar size={12} />
                Published {formatDate(draft.publishedAt)}
              </p>
            )}
          </FieldShell>

          {/* Author */}
          <FieldShell label="Author">
            <input
              type="text"
              value={draft.author}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder={DEFAULT_AUTHOR}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </FieldShell>

          {/* Banner */}
          <FieldShell label="Banner image">
            {draft.banner ? (
              <figure className="rounded-xl border border-border overflow-hidden">
                <div className="relative aspect-[16/9] bg-muted">
                  <img
                    src={draft.banner}
                    alt={draft.bannerAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {bannerUploading && (
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                      <Loader2
                        size={18}
                        className="text-primary-foreground animate-spin"
                      />
                    </div>
                  )}
                </div>
                <figcaption className="p-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBannerClick}
                    disabled={bannerUploading || saving}
                    className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground hover:text-primary px-2 py-1 rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} />
                    Replace
                  </button>
                </figcaption>
              </figure>
            ) : (
              <button
                type="button"
                onClick={handleBannerClick}
                disabled={bannerUploading || saving}
                className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors py-6 flex flex-col items-center gap-2 text-muted-foreground disabled:opacity-50"
              >
                {bannerUploading ? (
                  <Loader2 size={20} className="animate-spin text-primary" />
                ) : (
                  <Upload size={20} />
                )}
                <span className="text-xs font-medium">
                  {bannerUploading ? 'Uploading…' : 'Upload banner'}
                </span>
              </button>
            )}
            {bannerError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-start gap-1.5">
                <AlertCircle size={12} className="mt-0.5 shrink-0" />
                <span className="flex-1">{bannerError}</span>
              </p>
            )}
          </FieldShell>

          {/* Banner alt */}
          <FieldShell label="Banner alt text">
            <input
              type="text"
              value={draft.bannerAlt}
              onChange={(e) => updateField('bannerAlt', e.target.value)}
              placeholder="Describe the banner for screen readers"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </FieldShell>

          {/* Meta title */}
          <FieldShell label="Meta title" count={draft.metaTitle.length} max={MAX_META_TITLE}>
            <input
              type="text"
              value={draft.metaTitle}
              onChange={(e) => updateField('metaTitle', e.target.value.slice(0, MAX_META_TITLE))}
              maxLength={MAX_META_TITLE}
              placeholder="SEO title (falls back to the post title)"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </FieldShell>

          {/* Meta description */}
          <FieldShell
            label="Meta description"
            count={draft.metaDescription.length}
            max={MAX_META_DESC}
          >
            <textarea
              value={draft.metaDescription}
              onChange={(e) =>
                updateField('metaDescription', e.target.value.slice(0, MAX_META_DESC))
              }
              maxLength={MAX_META_DESC}
              rows={3}
              placeholder="One or two sentences for search results & social cards."
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            />
          </FieldShell>

          {/* Excerpt */}
          <FieldShell label="Excerpt" count={draft.excerpt.length} max={MAX_EXCERPT}>
            <textarea
              value={draft.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value.slice(0, MAX_EXCERPT))}
              maxLength={MAX_EXCERPT}
              rows={3}
              placeholder="A short hook for the blog card & listing."
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            />
          </FieldShell>

          {/* Live preview */}
          <FieldShell label="Preview">
            <article className="rounded-2xl border border-border/60 overflow-hidden shadow-[0_2px_10px_hsl(30_15%_80%_/_0.12)] bg-card">
              {draft.banner ? (
                <div className="aspect-[16/9] bg-muted overflow-hidden">
                  <img
                    src={draft.banner}
                    alt={draft.bannerAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                  <ImagePlus size={22} className="text-muted-foreground/70" />
                </div>
              )}
              <div className="p-4">
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-primary font-medium mb-1.5 inline-flex items-center gap-1">
                  <Eye size={10} />
                  {published ? formatDate(draft.publishedAt) : 'Draft'}
                </p>
                <h3
                  className="font-bold italic text-foreground mb-1 leading-snug"
                  style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}
                >
                  {draft.title.trim() || 'Untitled post'}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {draft.excerpt.trim() ||
                    'No excerpt yet — add one to preview the card.'}
                </p>
              </div>
            </article>
          </FieldShell>
        </aside>
      </div>
    </section>
  )
}

/* ─── Small presentational helpers ─── */

function FieldShell({
  label,
  hint,
  count,
  max,
  children,
}: {
  label: string
  hint?: string
  count?: number
  max?: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <label className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {label}
        </label>
        {typeof count === 'number' && typeof max === 'number' && (
          <span
            className={
              'text-[0.65rem] tabular-nums ' +
              (count > max
                ? 'text-red-600 font-medium'
                : count >= max - 5
                  ? 'text-[hsl(40_60%_35%)] font-medium'
                  : 'text-muted-foreground')
            }
          >
            {count}/{max}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: Blog['status'] }) {
  const published = status === 'published'
  return (
    <span
      className={
        'inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] font-semibold rounded-full px-2 py-0.5 ' +
        (published
          ? 'bg-[hsl(175_40%_92%)] text-[hsl(175_55%_28%)] border border-[hsl(175_40%_75%)]'
          : 'bg-[hsl(40_50%_92%)] text-[hsl(30_45%_30%)] border border-[hsl(40_40%_75%)]')
      }
    >
      <span
        className={
          'w-1.5 h-1.5 rounded-full ' +
          (published ? 'bg-[hsl(175_60%_45%)]' : 'bg-[hsl(40_70%_50%)]')
        }
      />
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
