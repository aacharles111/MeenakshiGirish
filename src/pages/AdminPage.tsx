import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { LogOut, ExternalLink } from 'lucide-react'
import useSEO from '../hooks/useSEO'
import useAdminSession from '../hooks/useAdminSession'
import FadeUp from '../components/FadeUp'

export default function AdminPage() {
  useSEO({
    title: 'CMS Dashboard — Meenakshi Girish',
    description: 'Content management system dashboard.',
    path: '/admin',
  })

  const { authed, loading, logout } = useAdminSession()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)

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

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setLogoutError(false)
    const ok = await logout()
    setLoggingOut(false)
    if (!ok) {
      // Server didn't confirm — cookie may still be valid. Stay on /admin.
      setLogoutError(true)
    }
    // On success, authed flips to false and <Navigate to="/login"> renders.
  }

  return (
    <section className="bg-background min-h-[80vh] py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <FadeUp>
          <div className="bg-card rounded-[2rem] p-8 md:p-12 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
            <h1
              className="font-bold italic text-foreground mb-2"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
            >
              CMS dashboard
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Panels coming in the next tasks.
            </p>

            {logoutError && (
              <div
                role="alert"
                className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3"
              >
                Couldn't reach the server to log out — please retry.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <ExternalLink size={14} />
                View site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {loggingOut ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Logging out…
                  </>
                ) : (
                  <>
                    <LogOut size={14} />
                    Log out
                  </>
                )}
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
