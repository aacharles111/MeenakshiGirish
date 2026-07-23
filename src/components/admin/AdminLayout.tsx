// src/components/admin/AdminLayout.tsx
// Dashboard shell: top bar, tab nav, panel slot, and the shared save-status
// flow. Content is loaded once by <AdminPage> and passed in; the actual panels
// (Blogs/Gallery/Testimonials/Featured/Book/Contact) land in Tasks 9–11 and
// drop into `renderPanel()` below as a one-line swap per tab.
//
// Save flow (driven by the `runSave` exposed via SaveContext):
//   saving → committed → [building → live] | error
// After a successful save we optionally poll GET /api/deploy-status (added in
// Task 15; 404s today). When the endpoint is missing we leave the status at
// `committed` and the banner shows the "rebuilds in ~1 min" fallback so the
// author always gets actionable feedback.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ExternalLink, Check, Loader2, AlertCircle, CloudUpload } from 'lucide-react'
import type { CmsContent } from '../../lib/cmsApi'
import GalleryPanel from './GalleryPanel'

type TabId = 'blogs' | 'gallery' | 'testimonials' | 'featured' | 'book' | 'contact'

interface AdminLayoutProps {
  content: CmsContent
  onSaved: () => void
  onLogout: () => void | Promise<boolean>
}

type SaveStatus =
  | { state: 'idle' }
  | { state: 'saving' }
  | { state: 'committed' }
  | { state: 'building' }
  | { state: 'live' }
  | { state: 'error'; message: string }

interface SaveContextValue {
  runSave: (fn: () => Promise<void>) => Promise<void>
  status: SaveStatus
}

const SaveContext = createContext<SaveContextValue | null>(null)

/** Panels (Tasks 9–11) call this to run a save through the shared status flow. */
export function useCmsSave(): SaveContextValue {
  const ctx = useContext(SaveContext)
  if (!ctx) throw new Error('useCmsSave must be used inside <AdminLayout>.')
  return ctx
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'blogs', label: 'Blogs' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'featured', label: 'Featured In' },
  { id: 'book', label: 'Book & Buy' },
  { id: 'contact', label: 'Contact & Socials' },
]

const POLL_INTERVAL_MS = 5000
const POLL_MAX_ATTEMPTS = 24 // ~2 minutes

export default function AdminLayout({ content, onSaved, onLogout }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('blogs')
  const [status, setStatus] = useState<SaveStatus>({ state: 'idle' })
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  // Clear any in-flight poll on unmount so we never setState after teardown.
  useEffect(() => stopPolling, [stopPolling])

  const pollDeployStatus = useCallback(() => {
    let attempts = 0
    const tick = async () => {
      if (attempts >= POLL_MAX_ATTEMPTS) {
        // Timed out waiting for `live` — leave the author on `building`
        // (a rebuild can legitimately take a couple of minutes).
        stopPolling()
        return
      }
      attempts += 1
      try {
        const res = await fetch('/api/deploy-status', { credentials: 'same-origin' })
        if (!res.ok) {
          // Endpoint not deployed yet (Task 15) — fall back to the
          // committed message and stop polling. Don't crash anything.
          stopPolling()
          setStatus({ state: 'committed' })
          return
        }
        const data = (await res.json().catch(() => ({}))) as { state?: string }
        const state = typeof data?.state === 'string' ? data.state.toLowerCase() : ''
        if (state === 'live' || state === 'ready' || state === 'done') {
          setStatus({ state: 'live' })
          stopPolling()
          return
        }
        if (state === 'error' || state === 'failed') {
          setStatus({
            state: 'error',
            message: 'Deploy failed — check Vercel and try again.',
          })
          stopPolling()
          return
        }
        // `building` / unknown — keep polling.
        setStatus({ state: 'building' })
        pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
      } catch {
        // Network/parse error — fall back gracefully.
        stopPolling()
        setStatus({ state: 'committed' })
      }
    }
    void tick()
  }, [stopPolling])

  const runSave = useCallback(
    async (fn: () => Promise<void>) => {
      stopPolling()
      setStatus({ state: 'saving' })
      try {
        await fn()
        onSaved()
        setStatus({ state: 'committed' })
        pollDeployStatus()
      } catch (err) {
        setStatus({
          state: 'error',
          message: err instanceof Error ? err.message : 'Save failed. Please try again.',
        })
      }
    },
    [onSaved, pollDeployStatus, stopPolling],
  )

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setLogoutError(false)
    const ok = await onLogout()
    setLoggingOut(false)
    if (!ok) setLogoutError(true)
    // On success the session probe flips authed=false in <AdminPage> and we
    // unmount via <Navigate to="/login">.
  }

  const renderPanel = (tab: TabId): ReactNode => {
    switch (tab) {
      case 'blogs':
        // Task 9: return <BlogsPanel content={content} />
        return (
          <ComingSoonPanel
            label="Blogs"
            summary={`${content.blogs.length} ${content.blogs.length === 1 ? 'post' : 'posts'}`}
          />
        )
      case 'gallery':
        return (
          <GalleryPanel
            images={content.gallery.images}
            onSaved={onSaved}
          />
        )
      case 'testimonials':
        // Task 10: return <TestimonialsPanel content={content} />
        return (
          <ComingSoonPanel
            label="Testimonials"
            summary={`${content.testimonials.testimonials.length} entries`}
          />
        )
      case 'featured':
        // Task 10: return <FeaturedPanel content={content} />
        return (
          <ComingSoonPanel
            label="Featured In"
            summary={`${content.featured.items.length} links`}
          />
        )
      case 'book':
        // Task 11: return <BookBuyPanel content={content} />
        return (
          <ComingSoonPanel
            label="Book & Buy"
            summary={content.settings.book?.title || 'Not configured'}
          />
        )
      case 'contact':
        // Task 11: return <ContactSocialsPanel content={content} />
        return (
          <ComingSoonPanel
            label="Contact & Socials"
            summary={`${content.settings.socials?.length ?? 0} ${content.settings.socials?.length === 1 ? 'social' : 'socials'}`}
          />
        )
      default:
        return null
    }
  }

  return (
    <section className="bg-background min-h-screen">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium">
              Admin
            </p>
            <h1
              className="font-bold italic text-foreground leading-tight truncate"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.05rem, 2vw, 1.35rem)' }}
            >
              Meenakshi Girish — CMS
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 sm:px-5 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-4 sm:px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loggingOut ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  <span className="hidden sm:inline">Logging out…</span>
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Log out</span>
                </>
              )}
            </button>
          </div>
        </div>
        {logoutError && (
          <div className="max-w-6xl mx-auto px-6 pb-3">
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              Couldn't reach the server to log out — please retry.
            </div>
          </div>
        )}
      </header>

      {/* ─── Body ─── */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Tab nav */}
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="CMS sections">
          {TABS.map((tab) => {
            const active = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? 'page' : undefined}
                className={
                  'font-semibold text-xs uppercase tracking-wide rounded-full px-4 sm:px-5 py-2.5 transition-all duration-200 border-2 ' +
                  (active
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_4px_14px_hsl(175_40%_45%_/_0.25)]'
                    : 'bg-card text-muted-foreground border-border/60 hover:text-primary hover:border-primary/40 hover:-translate-y-px')
                }
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <SaveContext.Provider value={{ runSave, status }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderPanel(activeTab)}
            </motion.div>
          </AnimatePresence>
          <SaveStatusToast status={status} />
        </SaveContext.Provider>
      </main>
    </section>
  )
}

/* ─── Placeholder panel (Tasks 9–11 swap with real components) ─── */

function ComingSoonPanel({ label, summary }: { label: string; summary: string }) {
  return (
    <div className="bg-card rounded-[2rem] p-8 md:p-12 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <CloudUpload size={26} className="text-primary" />
      </div>
      <h2
        className="font-bold italic text-foreground mb-1"
        style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
      >
        {label}
      </h2>
      <p className="text-xs uppercase tracking-[0.15em] text-primary/80 font-medium mb-4">
        {summary}
      </p>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        This panel is built in the next task. The content loads here and saves through the
        shared status flow.
      </p>
    </div>
  )
}

/* ─── Save-status toast ─── */

function SaveStatusToast({ status }: { status: SaveStatus }) {
  if (status.state === 'idle') return null

  const config: Record<
    Exclude<SaveStatus['state'], 'idle'>,
    { tone: 'saving' | 'success' | 'error'; icon: ReactNode; text: string }
  > = {
    saving: {
      tone: 'saving',
      icon: <Loader2 size={14} className="animate-spin" />,
      text: 'Saving…',
    },
    committed: {
      tone: 'success',
      icon: <Check size={14} />,
      text: 'Committed ✓ — site rebuilds in ~1 min.',
    },
    building: {
      tone: 'saving',
      icon: <Loader2 size={14} className="animate-spin" />,
      text: 'Build in progress…',
    },
    live: {
      tone: 'success',
      icon: <Check size={14} />,
      text: 'Live ✓ — your changes are published.',
    },
    error: {
      tone: 'error',
      icon: <AlertCircle size={14} />,
      text: 'message' in status ? status.message : 'Save failed.',
    },
  }

  const { tone, icon, text } = config[status.state]

  const toneClasses =
    tone === 'success'
      ? 'bg-[hsl(175_40%_96%)] border-[hsl(175_40%_70%)] text-[hsl(175_50%_30%)]'
      : tone === 'error'
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-[hsl(40_40%_96%)] border-[hsl(40_30%_75%)] text-[hsl(30_40%_30%)]'

  return (
    <AnimatePresence>
      <motion.div
        key={status.state + ('message' in status ? status.message : '')}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22 }}
        className="fixed bottom-6 right-6 z-40 max-w-[calc(100vw-3rem)]"
        role="status"
        aria-live="polite"
      >
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium shadow-[0_8px_24px_hsl(0_0%_0%_/_0.08)] ${toneClasses}`}
        >
          {icon}
          <span>{text}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
