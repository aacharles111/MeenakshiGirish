// src/components/admin/GalleryPanel.tsx
// Gallery management panel: grid of dome images with per-image alt text,
// replace (re-upload), remove (with confirm), reorder (up/down), and
// multi-file add via the upload endpoint. Saves flow through AdminLayout's
// SaveContext so the Saving→Committed→Building→Live toast is shared.
//
// Order is load-bearing — the Speaking-page DomeGallery tiles these around
// a 3D sphere in array order, so reordering here directly reshapes the dome.
// Alt text feeds accessibility + SEO (it's empty across the board today).

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'
import type { GalleryImage } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'

interface GalleryPanelProps {
  images: GalleryImage[]
  // AdminLayout's `runSave` already invokes `onSaved` itself after the save
  // callback resolves, so we accept the prop for API symmetry but don't call
  // it from inside `runSave` (that would double-fire the reload).
  onSaved: () => void
}

// Ephemeral id so React keys stay stable across reorder/edit and so we can
// key transient per-row upload state. Stripped before saving/persisting.
interface LocalImage extends GalleryImage {
  _id: string
}

type UploadState =
  | { state: 'uploading' }
  | { state: 'error'; message: string }

interface AddQueueEntry {
  id: string
  filename: string
  status: UploadState
}

let _idCounter = 0
function nextId(): string {
  _idCounter += 1
  return `gimg-${_idCounter}`
}

function withIds(list: GalleryImage[]): LocalImage[] {
  return list.map((img) => ({ ...img, _id: nextId() }))
}

function stripIds(list: LocalImage[]): GalleryImage[] {
  return list.map(({ src, alt }) => ({ src, alt }))
}

function sameImages(a: GalleryImage[], b: GalleryImage[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].src !== b[i].src || a[i].alt !== b[i].alt) return false
  }
  return true
}

// Mirror the server's 2 MiB upload cap (api/cms-upload.js).
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export default function GalleryPanel({ images }: GalleryPanelProps) {
  const { runSave, status } = useCmsSave()
  const [localImages, setLocalImages] = useState<LocalImage[]>(() => withIds(images))
  // Per-row upload state for Replace. Cleared on success or user-dismiss.
  const [replaceState, setReplaceState] = useState<Record<string, UploadState>>({})
  // Pending + failed Add uploads. Successful entries drop out once they land
  // in the grid; failures stay until dismissed so the user knows what missed.
  const [addQueue, setAddQueue] = useState<AddQueueEntry[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)

  const addInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  // Stash the row we're replacing between the click and the file `onChange`.
  const replaceTargetRef = useRef<string | null>(null)

  // Reset local edits when the parent reloads content (e.g. after save). When
  // the incoming images match what we already have, React still re-renders
  // but the dirty check below returns false — no UX churn.
  useEffect(() => {
    setLocalImages(withIds(images))
  }, [images])

  const dirty = !sameImages(stripIds(localImages), images)
  const saving = status.state === 'saving'
  const replaceInFlight = Object.values(replaceState).some(
    (s) => s.state === 'uploading',
  )
  const addInFlight = addQueue.some((e) => e.status.state === 'uploading')
  const uploading = replaceInFlight || addInFlight
  const canSave = dirty && !uploading && !saving

  // ── Field edits ──
  const updateAlt = (id: string, alt: string) => {
    setLocalImages((prev) =>
      prev.map((img) => (img._id === id ? { ...img, alt } : img)),
    )
  }

  const removeImage = (id: string) => {
    const target = localImages.find((img) => img._id === id)
    if (!target) return
    const filename = target.src.split('/').pop() || 'this image'
    const label = target.alt.trim() || filename
    if (!window.confirm(`Remove "${label}"? This cannot be undone after Save.`)) {
      return
    }
    setLocalImages((prev) => prev.filter((img) => img._id !== id))
  }

  const move = (id: string, dir: -1 | 1) => {
    setLocalImages((prev) => {
      const i = prev.findIndex((img) => img._id === id)
      if (i === -1) return prev
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = prev.slice()
      const [item] = next.splice(i, 1)
      next.splice(j, 0, item)
      return next
    })
  }

  // ── Add (multi-file). Each file is uploaded independently so one bad file
  // never blocks the rest.
  const handleAddClick = () => {
    setGlobalError(null)
    addInputRef.current?.click()
  }

  const handleAddChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    // Reset the input so selecting the same file again still fires onChange.
    if (addInputRef.current) addInputRef.current.value = ''
    if (files.length === 0) return
    setGlobalError(null)

    // Drop oversized files before they hit the network; the server rejects
    // them anyway, this just gives instant feedback.
    const oversized = files.filter((file) => file.size > MAX_IMAGE_BYTES)
    const accepted = files.filter((file) => file.size <= MAX_IMAGE_BYTES)
    if (oversized.length > 0 && accepted.length === 0) {
      setGlobalError(
        `Skipped ${oversized.length} file${
          oversized.length === 1 ? '' : 's'
        } over 2MB.`,
      )
      return
    }

    const staged: AddQueueEntry[] = accepted.map((file) => ({
      id: nextId(),
      filename: file.name,
      status: { state: 'uploading' },
    }))
    setAddQueue((prev) => [...prev, ...staged])

    const results = await Promise.allSettled(
      accepted.map((file) => cmsApi.uploadImage(file)),
    )

    const successes: GalleryImage[] = []
    const failureById: Record<string, UploadState> = {}
    results.forEach((res, idx) => {
      const entry = staged[idx]
      if (res.status === 'fulfilled') {
        successes.push({ src: res.value, alt: '' })
      } else {
        failureById[entry.id] = {
          state: 'error',
          message:
            res.reason instanceof Error ? res.reason.message : 'Upload failed',
        }
      }
    })

    if (successes.length > 0) {
      setLocalImages((prev) => [...prev, ...withIds(successes)])
    }

    // Successful entries drop out of the queue; failed ones stay until dismissed.
    setAddQueue((prev) =>
      prev
        .filter((entry) => Boolean(failureById[entry.id]))
        .map((entry) => ({ ...entry, status: failureById[entry.id] })),
    )

    // Note about oversized files dropped before upload, appended to whatever
    // summary the outcome below produces.
    const skippedNote =
      oversized.length > 0
        ? ` Skipped ${oversized.length} file${
            oversized.length === 1 ? '' : 's'
          } over 2MB.`
        : ''

    if (successes.length === 0) {
      setGlobalError(`No files uploaded. See errors below and retry.${skippedNote}`)
    } else if (Object.keys(failureById).length > 0) {
      setGlobalError(
        `Added ${successes.length} of ${accepted.length} file${
          accepted.length === 1 ? '' : 's'
        }. Some failed — see below.${skippedNote}`,
      )
    } else if (skippedNote) {
      setGlobalError(`Added ${successes.length} file${successes.length === 1 ? '' : 's'}.${skippedNote}`)
    }
  }

  const dismissAddQueueEntry = (id: string) => {
    setAddQueue((prev) => prev.filter((entry) => entry.id !== id))
  }

  // ── Replace (single file, swap src in place, keep alt text) ──
  const handleReplaceClick = (id: string) => {
    replaceTargetRef.current = id
    replaceInputRef.current?.click()
  }

  const handleReplaceChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const id = replaceTargetRef.current
    const file = e.target.files?.[0]
    if (replaceInputRef.current) replaceInputRef.current.value = ''
    replaceTargetRef.current = null
    if (!id || !file) return
    if (file.size > MAX_IMAGE_BYTES) {
      setReplaceState((prev) => ({
        ...prev,
        [id]: { state: 'error', message: 'Image is too large (max 2MB).' },
      }))
      return
    }
    setGlobalError(null)
    setReplaceState((prev) => ({ ...prev, [id]: { state: 'uploading' } }))
    try {
      const url = await cmsApi.uploadImage(file)
      setLocalImages((prev) =>
        prev.map((img) => (img._id === id ? { ...img, src: url } : img)),
      )
      setReplaceState((prev) => {
        if (!(id in prev)) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
    } catch (err) {
      setReplaceState((prev) => ({
        ...prev,
        [id]: {
          state: 'error',
          message: err instanceof Error ? err.message : 'Upload failed',
        },
      }))
    }
  }

  const clearReplaceError = (id: string) => {
    setReplaceState((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // ── Save. The shell handles the status flow and the post-save reload. ──
  const handleSave = async () => {
    if (!canSave) return
    setGlobalError(null)
    await runSave(async () => {
      await cmsApi.saveGallery(stripIds(localImages))
    })
  }

  return (
    <section className="space-y-6">
      {/* Header / actions */}
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              Speaking · Dome Gallery
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              Photos
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {localImages.length}{' '}
              {localImages.length === 1 ? 'image' : 'images'} in the dome. Order
              matters — tiles are laid out in array order.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {dirty && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(40_60%_35%)] bg-[hsl(40_50%_95%)] border border-[hsl(40_40%_75%)] rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(40_70%_50%)]" />
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={handleAddClick}
              disabled={saving}
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-60"
            >
              <ImagePlus size={14} />
              Add photos
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save
            </button>
          </div>
        </div>
        {globalError && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 flex items-start gap-2"
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{globalError}</span>
          </div>
        )}
      </div>

      {/* Hidden file inputs — one for Add (multi), one for Replace (single). */}
      <input
        ref={addInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAddChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Empty state */}
      {localImages.length === 0 && addQueue.length === 0 && (
        <div className="bg-card rounded-[2rem] p-10 md:p-14 border border-dashed border-border text-center">
          <Upload size={28} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No photos yet</p>
          <p className="text-sm text-muted-foreground mb-5">
            Add some to populate the dome.
          </p>
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] transition-all duration-200"
          >
            <ImagePlus size={14} />
            Add photos
          </button>
        </div>
      )}

      {/* Grid */}
      {localImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {localImages.map((img, idx) => {
            const upload = replaceState[img._id]
            const isUploading = upload?.state === 'uploading'
            const uploadError = upload?.state === 'error' ? upload.message : null
            return (
              <figure
                key={img._id}
                className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-[0_2px_10px_hsl(30_15%_80%_/_0.12)] flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                      <Loader2
                        size={20}
                        className="text-primary-foreground animate-spin"
                      />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-[0.65rem] font-semibold uppercase tracking-wide bg-background/85 text-foreground rounded-full px-2 py-0.5">
                    {idx + 1}
                  </span>
                </div>
                <figcaption className="p-3 flex flex-col gap-2 flex-1">
                  <label className="block">
                    <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                      Alt text
                    </span>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateAlt(img._id, e.target.value)}
                      placeholder="Describe this image"
                      className="mt-1 w-full bg-input border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </label>
                  {uploadError && (
                    <p className="text-[0.7rem] text-red-600 flex items-start gap-1.5">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      <span className="flex-1">{uploadError}</span>
                      <button
                        type="button"
                        onClick={() => clearReplaceError(img._id)}
                        className="text-red-700 underline underline-offset-2 hover:text-red-900"
                      >
                        Dismiss
                      </button>
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(img._id, -1)}
                        disabled={idx === 0}
                        aria-label="Move image up"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(img._id, 1)}
                        disabled={idx === localImages.length - 1}
                        aria-label="Move image down"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleReplaceClick(img._id)}
                        disabled={isUploading || saving}
                        aria-label="Replace image with a new upload"
                        className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground hover:text-primary px-2 py-1.5 rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={13} />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img._id)}
                        disabled={saving}
                        aria-label="Remove image"
                        className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground hover:text-red-600 px-2 py-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      )}

      {/* Upload queue — shows pending + failed Add uploads. */}
      {addQueue.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/60 p-4 space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Uploads
          </p>
          {addQueue.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm">
              {entry.status.state === 'uploading' ? (
                <Loader2 size={14} className="animate-spin text-primary" />
              ) : (
                <AlertCircle size={14} className="text-red-500 shrink-0" />
              )}
              <span className="flex-1 truncate text-foreground">
                {entry.filename}
              </span>
              {entry.status.state === 'error' && (
                <>
                  <span className="text-xs text-red-600 truncate max-w-[40%]">
                    {entry.status.message}
                  </span>
                  <button
                    type="button"
                    onClick={() => dismissAddQueueEntry(entry.id)}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                  >
                    Dismiss
                  </button>
                </>
              )}
              {entry.status.state === 'uploading' && (
                <span className="text-xs text-muted-foreground">Uploading…</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
