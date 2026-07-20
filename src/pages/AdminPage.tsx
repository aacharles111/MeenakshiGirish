import { Navigate, Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

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
    await logout()
    navigate('/login', { replace: true })
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
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
