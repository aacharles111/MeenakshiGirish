import { useEffect, useState } from 'react'

interface AdminSessionState {
  authed: boolean
  loading: boolean
  logout: () => Promise<boolean>
}

/**
 * Probes the CMS session cookie via GET /api/admin-session on mount and
 * exposes a `logout()` that clears it. On network failure `logout()` returns
 * false and leaves the session intact (fail-closed) — the UI never claims
 * logged-out while the server cookie may still be valid.
 */
export default function useAdminSession(): AdminSessionState {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin-session', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data: { authed?: boolean }) => {
        if (cancelled) return
        setAuthed(Boolean(data?.authed))
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setAuthed(false)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const logout = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin-logout', { method: 'POST', credentials: 'same-origin' })
      if (!res.ok) return false
      setAuthed(false)
      return true
    } catch {
      return false // network failure — cookie may still be valid; do NOT claim logged out
    }
  }

  return { authed, loading, logout }
}
