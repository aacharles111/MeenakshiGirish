import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, AlertCircle } from 'lucide-react'
import useSEO from '../hooks/useSEO'
import useAdminSession from '../hooks/useAdminSession'
import FadeUp from '../components/FadeUp'

export default function LoginPage() {
  useSEO({
    title: 'Admin Login — Meenakshi Girish',
    description: 'Admin login',
    path: '/login',
  })

  const { authed, loading: sessionLoading } = useAdminSession()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Already logged in → skip straight to the dashboard.
  if (!sessionLoading && authed) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Invalid credentials')
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-background min-h-[80vh] flex items-center justify-center py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <FadeUp>
          <div className="bg-card rounded-[2rem] p-8 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)]">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Lock size={26} className="text-primary" />
              </div>
              <h1
                className="font-bold italic text-foreground mb-2"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}
              >
                Admin Login
              </h1>
              <p className="text-muted-foreground text-sm">
                Reserved for the site admin. Move along, nothing to see here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
              <div>
                <label htmlFor="login-username" className="block text-foreground text-sm font-medium mb-1.5">
                  Username
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="username"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-foreground text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
