// src/components/admin/TestimonialsPanel.tsx
// Testimonials CRUD: editable list of reader/attendee quotes (quote, author,
// role) with add/remove. Saves flow through AdminLayout's SaveContext so the
// shared Saving→Committed→Building→Live toast stays consistent. The shell
// invokes `onSaved` itself after the save callback resolves, so this panel
// never calls it directly (that would double-fire the reload).

import { useState } from 'react'
import {
  AlertCircle,
  Loader2,
  Plus,
  Quote,
  Save,
  Trash2,
} from 'lucide-react'
import type { Testimonial } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'

interface TestimonialsPanelProps {
  testimonials: Testimonial[]
}

function cloneList(list: Testimonial[]): Testimonial[] {
  return list.map((t) => ({ ...t }))
}

function sameList(a: Testimonial[], b: Testimonial[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].id !== b[i].id ||
      a[i].quote !== b[i].quote ||
      a[i].author !== b[i].author ||
      a[i].role !== b[i].role
    ) {
      return false
    }
  }
  return true
}

function emptyTestimonial(): Testimonial {
  return { id: crypto.randomUUID(), quote: '', author: '', role: '' }
}

export default function TestimonialsPanel({
  testimonials,
}: TestimonialsPanelProps) {
  const { runSave, status } = useCmsSave()
  const [local, setLocal] = useState<Testimonial[]>(() => cloneList(testimonials))
  // Reset local edits when the parent reloads content (e.g. after save).
  // Per the React docs' "adjusting state when a prop changes" pattern we
  // compare against the previous prop reference and setState during render —
  // this avoids the setState-in-effect lint and the extra commit it causes.
  const [lastSource, setLastSource] = useState(testimonials)
  if (testimonials !== lastSource) {
    setLastSource(testimonials)
    setLocal(cloneList(testimonials))
  }

  const dirty = !sameList(local, testimonials)
  const saving = status.state === 'saving'
  const serverError = status.state === 'error' ? status.message : null
  const canSave = dirty && !saving

  const add = () => {
    setLocal((prev) => [...prev, emptyTestimonial()])
  }

  const update = <K extends keyof Testimonial>(
    id: string,
    key: K,
    value: Testimonial[K],
  ) => {
    setLocal((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)),
    )
  }

  const remove = (id: string) => {
    const target = local.find((t) => t.id === id)
    if (!target) return
    const label = target.quote.trim().slice(0, 60) || 'this testimonial'
    if (
      !window.confirm(
        `Remove "${label}${
          target.quote.length > 60 ? '…' : ''
        }"? This cannot be undone after Save.`,
      )
    ) {
      return
    }
    setLocal((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = async () => {
    if (!canSave) return
    await runSave(async () => {
      await cmsApi.saveTestimonials(local)
    })
  }

  return (
    <section className="space-y-6">
      {/* Header / actions */}
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              Social proof · Quotes
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              Testimonials
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {local.length} {local.length === 1 ? 'entry' : 'entries'}. Short
              quotes from readers, attendees, and clients.
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
              Add entry
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
          <Quote size={28} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">
            No testimonials yet
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Add a quote to start building social proof.
          </p>
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-[hsl(175_35%_50%)] transition-all duration-200"
          >
            <Plus size={14} />
            Add entry
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {local.map((t) => (
            <li
              key={t.id}
              className="bg-card rounded-2xl border border-border/60 p-5 shadow-[0_2px_10px_hsl(30_15%_80%_/_0.12)]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  <Quote size={12} className="text-primary/70" />
                  Testimonial
                </span>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  disabled={saving}
                  aria-label="Remove testimonial"
                  className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground hover:text-red-600 px-2 py-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
              <label className="block mb-3">
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  Quote
                </span>
                <textarea
                  value={t.quote}
                  onChange={(e) => update(t.id, 'quote', e.target.value)}
                  rows={3}
                  placeholder="What they said — in their words."
                  className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                    Author
                  </span>
                  <input
                    type="text"
                    value={t.author}
                    onChange={(e) => update(t.id, 'author', e.target.value)}
                    placeholder="e.g. Aspiring Author"
                    className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                    Role
                  </span>
                  <input
                    type="text"
                    value={t.role}
                    onChange={(e) => update(t.id, 'role', e.target.value)}
                    placeholder="e.g. Talk Attendee"
                    className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
