// src/components/admin/ContactSocialsPanel.tsx
// Contact + socials settings: contact.email + a list of social links
// (label, url, icon). Saves flow through AdminLayout's SaveContext so the
// shared Saving→Committed→Building→Live toast stays consistent. The shell
// invokes `onSaved` itself after the save callback resolves.
//
// IMPORTANT: saveSettings() replaces the WHOLE SiteSettings object server-
// side, so we merge our slices over the incoming `settings` prop
// (`{ ...settings, contact, socials }`) — otherwise Book & Buy would be
// wiped on every Contact save.

import { useState } from 'react'
import {
  AlertCircle,
  Instagram,
  Loader2,
  Linkedin,
  Mail,
  Music2,
  Plus,
  Save,
  Trash2,
  Youtube,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SiteSettings } from '../../lib/contentTypes'
import cmsApi from '../../lib/cmsApi'
import { useCmsSave } from './AdminLayout'

interface ContactSocialsPanelProps {
  settings: SiteSettings
}

type Social = SiteSettings['socials'][number]
type SocialIcon = Social['icon']

const ICON_OPTIONS: { value: SocialIcon; label: string; Icon: LucideIcon }[] = [
  { value: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { value: 'instagram', label: 'Instagram', Icon: Instagram },
  { value: 'youtube', label: 'YouTube', Icon: Youtube },
  // lucide-react has no Spotify glyph; Music2 matches the public Footer's
  // treatment of the Spotify link.
  { value: 'spotify', label: 'Spotify', Icon: Music2 },
]

function iconFor(value: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.value === value)?.Icon ?? Music2
}

// Ephemeral stable id so React keys survive reorder/remove (the Social type
// has no id field). Stripped before saving.
interface LocalSocial extends Social {
  _id: string
}

function withIds(list: Social[] | undefined): LocalSocial[] {
  return Array.isArray(list)
    ? list.map((s) => ({ ...s, _id: crypto.randomUUID() }))
    : []
}

function stripIds(list: LocalSocial[]): Social[] {
  return list.map(({ label, url, icon }) => ({ label, url, icon }))
}

function sameSocials(a: LocalSocial[], b: LocalSocial[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].label !== b[i].label ||
      a[i].url !== b[i].url ||
      a[i].icon !== b[i].icon
    ) {
      return false
    }
  }
  return true
}

function emptySocial(): LocalSocial {
  return { _id: crypto.randomUUID(), label: '', url: '', icon: 'linkedin' }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Mirror the server's URL rule (api/_cmsContent.js URL_RE). Accepts http(s)://
// URLs or a bare `#` placeholder.
const URL_RE = /^(https?:\/\/[^\s<>"']+|#)$/

export default function ContactSocialsPanel({
  settings,
}: ContactSocialsPanelProps) {
  const { runSave, status } = useCmsSave()
  const [email, setEmail] = useState<string>(() => settings.contact?.email ?? '')
  const [socials, setSocials] = useState<LocalSocial[]>(() =>
    withIds(settings.socials),
  )
  // Reset when the parent reloads content (e.g. after save) — see
  // TestimonialsPanel for the rationale on the render-time pattern.
  const [lastSource, setLastSource] = useState(settings)
  if (settings !== lastSource) {
    setLastSource(settings)
    setEmail(settings.contact?.email ?? '')
    setSocials(withIds(settings.socials))
  }

  const saving = status.state === 'saving'
  const serverError = status.state === 'error' ? status.message : null

  const incomingEmail = settings.contact?.email ?? ''
  const incomingSocials = withIds(settings.socials)
  const dirty = email !== incomingEmail || !sameSocials(socials, incomingSocials)

  const emailValid = EMAIL_RE.test(email.trim())
  const allSocialUrlsValid = socials.every((s) => URL_RE.test(s.url.trim()))
  const canSave = dirty && emailValid && allSocialUrlsValid && !saving

  const addSocial = () => setSocials((prev) => [...prev, emptySocial()])

  const updateSocial = <K extends keyof Social>(
    id: string,
    key: K,
    value: Social[K],
  ) => {
    setSocials((prev) =>
      prev.map((s) => (s._id === id ? { ...s, [key]: value } : s)),
    )
  }

  const removeSocial = (id: string) => {
    const target = socials.find((s) => s._id === id)
    if (!target) return
    const label = target.label.trim() || 'this social'
    if (
      !window.confirm(`Remove "${label}"? This cannot be undone after Save.`)
    ) {
      return
    }
    setSocials((prev) => prev.filter((s) => s._id !== id))
  }

  const handleSave = async () => {
    if (!canSave) return
    const nextSocials = stripIds(socials)
    await runSave(async () => {
      await cmsApi.saveSettings({
        ...settings,
        contact: { email: email.trim() },
        socials: nextSocials,
      })
    })
  }

  return (
    <section className="space-y-6">
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary font-medium mb-1">
              Reach · Email + Socials
            </p>
            <h2
              className="font-bold italic text-foreground"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
            >
              Contact & Socials
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Where readers can reach you. Book settings live on their own tab.
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

      {/* Email */}
      <div className="bg-card rounded-[2rem] border border-border/50 p-6 md:p-8 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <label className="block">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Contact email
          </span>
          <div className="mt-1 relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          {email.length > 0 && !emailValid && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle size={12} className="shrink-0" />
              Enter a valid email address.
            </p>
          )}
        </label>
      </div>

      {/* Socials */}
      <div className="bg-card rounded-[2rem] border border-border/50 p-6 md:p-8 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
              Social links
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {socials.length} {socials.length === 1 ? 'link' : 'links'}.
            </p>
          </div>
          <button
            type="button"
            onClick={addSocial}
            disabled={saving}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-60"
          >
            <Plus size={14} />
            Add social
          </button>
        </div>

        {socials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No socials yet — add one to populate the footer.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {socials.map((s) => {
              const Icon = iconFor(s.icon)
              return (
                <li
                  key={s._id}
                  className="rounded-xl border border-border/60 p-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr_1.4fr_auto] gap-3 items-end">
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        Icon
                      </span>
                      <div className="mt-1 relative">
                        <Icon
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <select
                          value={s.icon}
                          onChange={(e) =>
                            updateSocial(
                              s._id,
                              'icon',
                              e.target.value as SocialIcon,
                            )
                          }
                          className="w-full appearance-none bg-input border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          {ICON_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        Label
                      </span>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) =>
                          updateSocial(s._id, 'label', e.target.value)
                        }
                        placeholder="LinkedIn"
                        className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        URL
                      </span>
                      <input
                        type="text"
                        value={s.url}
                        onChange={(e) =>
                          updateSocial(s._id, 'url', e.target.value)
                        }
                        placeholder="https://…"
                        className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      {s.url.trim().length > 0 &&
                        !URL_RE.test(s.url.trim()) && (
                          <p className="mt-1 text-[0.7rem] text-red-600">
                            Enter a valid https:// URL (or #).
                          </p>
                        )}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSocial(s._id)}
                      disabled={saving}
                      aria-label="Remove social"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 mb-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
