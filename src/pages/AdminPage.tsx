import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AlertCircle, RefreshCw } from 'lucide-react'
import useSEO from '../hooks/useSEO'
import useAdminSession from '../hooks/useAdminSession'
import AdminLayout from '../components/admin/AdminLayout'
import { getContent, type CmsContent } from '../lib/cmsApi'

export default function AdminPage() {
  useSEO({
    title: 'CMS Dashboard — Meenakshi Girish',
    description: 'Content management system dashboard.',
    path: '/admin',
  })

  const { authed, loading, logout } = useAdminSession()
  const [content, setContent] = useState<CmsContent | null>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState('')

  const loadContent = useCallback(async () => {
    setContentLoading(true)
    setContentError('')
    try {
      const data = await getContent()
      setContent(data)
    } catch (err) {
      setContentError(
        err instanceof Error ? err.message : 'Could not load content. Please try again.',
      )
    } finally {
      setContentLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    void loadContent()
  }, [authed, loadContent])

  if (loading) {
    return (
      <section className="bg-background min-h-[80vh] flex items-center justify-center py-28">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <span className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Checking session…
        </div>
      </section>
    )
  }

  if (!authed) {
    return <Navigate to="/login" replace />
  }

  // Auth-gated content area. While content is loading (or retrying after an
  // error) we render a lightweight state instead of the full shell so a failed
  // GitHub read never strands the author inside the dashboard with no data.
  if (contentLoading || !content) {
    return (
      <section className="bg-background min-h-[80vh] flex items-center justify-center py-28">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <span className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading content…
        </div>
      </section>
    )
  }

  if (contentError) {
    return (
      <section className="bg-background min-h-[80vh] flex items-center justify-center py-28 px-6">
        <div className="bg-card rounded-[2rem] p-8 md:p-10 max-w-md w-full text-center border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={26} className="text-red-600" />
          </div>
          <h1
            className="font-bold italic text-foreground mb-2"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem' }}
          >
            Couldn’t load the dashboard
          </h1>
          <p className="text-muted-foreground text-sm mb-6">{contentError}</p>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <AdminLayout
      content={content}
      onSaved={() => void loadContent()}
      onLogout={logout}
    />
  )
}
