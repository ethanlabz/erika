'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

type AuthView = 'LOGIN' | 'FORGOT_PASSWORD'

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('LOGIN')

  // Split loading states for precise UI feedback
  const [loading, setLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setMessage({ type: 'error', text: errorParam })
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // 1. Capture Device and Location Data
      const deviceInfo = navigator.userAgent;
      let locationData = 'Unknown';
      try {
        const locRes = await fetch('https://ipapi.co/json/');
        const locJson = await locRes.json();
        locationData = `${locJson.city}, ${locJson.region}, ${locJson.country_name} (${locJson.ip})`;
      } catch (err) {
        locationData = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }

      if (view === 'LOGIN') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        // 2. Log the successful login action
        if (data.user) {
          await supabase.from('auth_logs').insert([
            {
              user_id: data.user.id,
              email: data.user.email,
              action: 'LOGIN',
              device_info: deviceInfo,
              location: locationData
            }
          ])
        }

        // Old: router.push('/docs')
        router.push('/')
        router.refresh()
      }
      else if (view === 'FORGOT_PASSWORD') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Password reset link sent to your email.' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleGitHub = async () => {
  setIsGithubLoading(true)
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
  })
}

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {view === 'LOGIN' ? 'Welcome back' : 'Reset Password'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === 'LOGIN' ? 'Enter your credentials to access the vault.' : 'Enter your email to receive a secure reset link.'}
          </p>
        </div>

        {message && (
          <div className={`mb-6 animate-in fade-in slide-in-from-top-2 rounded-lg p-4 text-sm font-medium ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-green-500/15 text-green-600 dark:text-green-400'
            }`}>
            {message.text}
          </div>
        )}

        {view !== 'FORGOT_PASSWORD' && (
          <>
            {/* 🟢 Premium Animated GitHub Button */}
            <button
              type="button"
              onClick={handleGitHub}
              disabled={isGithubLoading || loading}
              className="group relative flex h-11 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-input bg-background text-sm font-medium transition-all duration-300 ease-out hover:bg-muted active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {isGithubLoading ? (
                <SpinnerIcon className="h-5 w-5 text-foreground" />
              ) : (
                <GithubIcon className="transition-transform duration-300 group-hover:-translate-y-1" />
              )}
              <span className="relative text-foreground">
                {isGithubLoading ? 'Authenticating...' : 'Continue with GitHub'}
              </span>

              {/* Subtle hover shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase text-muted-foreground">Or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <input
              type="email" name="email" required disabled={loading || isGithubLoading}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {view !== 'FORGOT_PASSWORD' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button
                  type="button"
                  disabled={loading || isGithubLoading}
                  onClick={() => { setView('FORGOT_PASSWORD'); setMessage(null); }}
                  className="text-xs text-primary transition-colors hover:text-primary/80 hover:underline disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password" name="password" required disabled={loading || isGithubLoading}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          )}

          {/* 🟢 Premium Animated Submit Button */}
          <Button
            type="submit"
            className="group relative mt-2 h-11 overflow-hidden transition-all duration-300 active:scale-[0.98]"
            disabled={loading || isGithubLoading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="h-4 w-4" />
                {view === 'LOGIN' ? 'Signing In...' : 'Sending Link...'}
              </span>
            ) : (
              <span className="relative z-10">
                {view === 'LOGIN' ? 'Sign In' : 'Send Reset Link'}
              </span>
            )}

            {/* Subtle hover shine effect */}
            {!loading && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {view === 'FORGOT_PASSWORD' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => { setView('LOGIN'); setMessage(null); }}
              className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline disabled:opacity-50"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={`size-5 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className || 'h-5 w-5'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}