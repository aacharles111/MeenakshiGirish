import { useEffect, useState } from 'react'

interface AdminSessionState {
  authed: boolean
  loading: boolean
  logout: () => Promise<void>
}

/**
 * Probes the CMS session cookie via GET /api/admin-session on mount and
 * exposes a `logout()` that clears it. Network failures collapse to the
 * logged-out state so the UI always lands on the login screen.
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

  const logout = async () => {
    try {
      await fetch('/api/admin-logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
    } catch {
      // swallow — we still flip the client state so the UI bounces to /login
    }
    setAuthed(false)
  }

  return { authed, loading, logout }
}
