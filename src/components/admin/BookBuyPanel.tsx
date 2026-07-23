// src/components/admin/BookBuyPanel.tsx
// Book & Buy settings: a single form editing settings.book — priceInr,
// title, and buyCtaLabel. Saves flow through AdminLayout's SaveContext so
// the shared Saving→Committed→Building→Live toast stays consistent. The
// shell invokes `onSaved` itself after the save callback resolves.
//
// IMPORTANT: saveSettings() replaces the WHOLE SiteSettings object server-
// side, so we merge our slice over the incoming `settings` prop
// (`{ ...settings, book: nextBook }`) — otherwise Contact & Socials would
// be wiped on every Book save.

import { useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  IndianRupee,
  Loader2,
  Save,
  Tag,
} from 'lucide-react'
import type { SiteSettings } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'

interface BookBuyPanelProps {
  settings: SiteSettings
}

interface BookForm {
  priceInr: string
  title: string
  buyCtaLabel: string
}

// `settings.book` may be partially populated on a fresh install (the API's
// fallback shape is `{}`), so read defensively.
function toForm(book: SiteSettings['book'] | undefined): BookForm {
  return {
    priceInr:
      book && typeof book.priceInr === 'number' && Number.isFinite(book.priceInr)
        ? String(book.priceInr)
        : '',
    title: book?.title ?? '',
    buyCtaLabel: book?.buyCtaLabel ?? '',
  }
}

function sameBook(a: BookForm, b: BookForm): boolean {
  return (
    a.priceInr === b.priceInr &&
    a.title === b.title &&
    a.buyCtaLabel === b.buyCtaLabel
  )
}

export default function BookBuyPanel({ settings }: BookBuyPanelProps) {
  const { runSave, status } = useCmsSave()
  const [form, setForm] = useState<BookForm>(() => toForm(settings.book))
  // Reset when the parent reloads content (e.g. after save) — see
  // TestimonialsPanel for the rationale on the render-time pattern.
  const [lastSource, setLastSource] = useState(settings)
  if (settings !== lastSource) {
    setLastSource(settings)
    setForm(toForm(settings.book))
  }

  const saving = status.state === 'saving'
  const serverError = status.state === 'error' ? status.message : null

  const incoming = toForm(settings.book)
  const dirty = !sameBook(form, incoming)

  // priceInr must parse to an integer ≥ 1. Server re-validates.
  const parsedPrice = Number.parseInt(form.priceInr, 10)
  const priceValid = Number.isFinite(parsedPrice) && parsedPrice >= 1
  const canSave = dirty && priceValid && !saving

  const handleSave = async () => {
    if (!canSave) return
    const price = Number.parseInt(form.priceInr, 10)
    await runSave(async () => {
      await cmsApi.saveSettings({
        ...settings,
        book: {
          priceInr: price,
          title: form.title.trim(),
          buyCtaLabel: form.buyCtaLabel.trim(),
        },
      })
    })
  }

  return (
    <section className="space-y-6">
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              Commerce · Book
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              Book & Buy
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Pricing and CTA copy for the buy flow. Contact & socials live on
              their own tab.
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

      <div className="bg-card rounded-[2rem] border border-border/50 p-6 md:p-8 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] space-y-5">
        {/* Title */}
        <label className="block">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Book title
          </span>
          <div className="mt-1 relative">
            <BookOpen
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="The Freelancer's Mindset"
              className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              style={{ fontFamily: 'var(--font-playfair)' }}
            />
          </div>
        </label>

        {/* Price */}
        <label className="block">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Price (INR)
          </span>
          <div className="mt-1 relative">
            <IndianRupee
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="number"
              min={1}
              step={1}
              value={form.priceInr}
              onChange={(e) =>
                setForm((f) => ({ ...f, priceInr: e.target.value }))
              }
              placeholder="e.g. 399"
              className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          {!priceValid && form.priceInr.length > 0 && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle size={12} className="shrink-0" />
              Price must be a whole number of at least ₹1.
            </p>
          )}
        </label>

        {/* CTA label */}
        <label className="block">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Buy CTA label
          </span>
          <div className="mt-1 relative">
            <Tag
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={form.buyCtaLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, buyCtaLabel: e.target.value }))
              }
              placeholder="Buy The Freelancer's Mindset"
              className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Text on the buy button. Keep it short and action-oriented.
          </p>
        </label>
      </div>
    </section>
  )
}
