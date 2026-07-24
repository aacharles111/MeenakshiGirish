// src/components/admin/FeaturedPanel.tsx
// Featured-In CRUD: editable list of press/mention links (label, url) with
// add/remove. Saves flow through AdminLayout's SaveContext so the shared
// Saving→Committed→Building→Live toast stays consistent. The shell invokes
// `onSaved` itself after the save callback resolves, so this panel never
// calls it directly (that would double-fire the reload).

import { useState } from 'react'
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Newspaper,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import type { FeaturedItem } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'

interface FeaturedPanelProps {
  items: FeaturedItem[]
}

// Accept http(s):// or a `#` placeholder anchor. Mirrors the server's URL_RE
// (api/_cmsContent.js) exactly.
const URL_RE = /^(https?:\/\/[^\s<>"']+|#)$/

function cloneList(list: FeaturedItem[]): FeaturedItem[] {
  return list.map((it) => ({ ...it }))
}

function sameList(a: FeaturedItem[], b: FeaturedItem[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].id !== b[i].id ||
      a[i].label !== b[i].label ||
      a[i].url !== b[i].url
    ) {
      return false
    }
  }
  return true
}

function emptyItem(): FeaturedItem {
  return { id: crypto.randomUUID(), label: '', url: '' }
}

export default function FeaturedPanel({ items }: FeaturedPanelProps) {
  const { runSave, status } = useCmsSave()
  const [local, setLocal] = useState<FeaturedItem[]>(() => cloneList(items))
  // Reset local edits when the parent reloads content (e.g. after save) —
  // see TestimonialsPanel for the rationale on the render-time pattern.
  const [lastSource, setLastSource] = useState(items)
  if (items !== lastSource) {
    setLastSource(items)
    setLocal(cloneList(items))
  }

  const dirty = !sameList(local, items)
  const saving = status.state === 'saving'
  const serverError = status.state === 'error' ? status.message : null
  const allUrlsValid = local.every((it) => URL_RE.test(it.url.trim()))
  const canSave = dirty && allUrlsValid && !saving

  const add = () => setLocal((prev) => [...prev, emptyItem()])

  const update = <K extends keyof FeaturedItem>(
    id: string,
    key: K,
    value: FeaturedItem[K],
  ) => {
    setLocal((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)),
    )
  }

  const remove = (id: string) => {
    const target = local.find((it) => it.id === id)
    if (!target) return
    const label = target.label.trim() || 'this entry'
    if (
      !window.confirm(`Remove "${label}"? This cannot be undone after Save.`)
    ) {
      return
    }
    setLocal((prev) => prev.filter((it) => it.id !== id))
  }

  const handleSave = async () => {
    if (!canSave) return
    await runSave(async () => {
      await cmsApi.saveFeatured(local)
    })
  }

  return (
    <section className="space-y-6">
      {/* Header / actions */}
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              Press · Mentions
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              Featured In
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {local.length} {local.length === 1 ? 'link' : 'links'}. Press
              features, interviews, and mentions.
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
              onClick={add}
              disabled={saving}
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-60"
            >
              <Plus size={14} />
              Add link
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

      {local.length === 0 ? (
        <div className="bg-card rounded-[2rem] p-10 md:p-14 border border-dashed border-border text-center">
          <Newspaper size={28} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">
            No featured links yet
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Add a press mention or interview link.
          </p>
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] transition-all duration-200"
          >
            <Plus size={14} />
            Add link
          </button>
        </div>
      ) : (
        <ul className="bg-card rounded-[2rem] border border-border/50 overflow-hidden divide-y divide-border/60">
          {local.map((it) => {
            const trimmed = it.url.trim()
            const urlOk = URL_RE.test(trimmed)
            const urlEmpty = trimmed.length === 0
            const openable = urlOk && trimmed !== '#'
            return (
              <li key={it.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-[220px] grid grid-cols-1 sm:grid-cols-[1fr_1.4fr] gap-3">
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        Label
                      </span>
                      <input
                        type="text"
                        value={it.label}
                        onChange={(e) => update(it.id, 'label', e.target.value)}
                        placeholder="e.g. The New Indian Express"
                        className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        URL
                      </span>
                      <input
                        type="text"
                        value={it.url}
                        onChange={(e) => update(it.id, 'url', e.target.value)}
                        placeholder="https://… or #"
                        className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      {!urlEmpty && !urlOk && (
                        <p className="mt-1 text-[0.7rem] text-red-600">
                          Use http(s):// or #.
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 sm:pt-5">
                    {openable && (
                      <a
                        href={trimmed}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open in new tab"
                        className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      disabled={saving}
                      aria-label="Remove link"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
