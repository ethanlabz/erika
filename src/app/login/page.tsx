'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('LOGIN')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // 1. 🟢 Capture Device and Location Data
      const deviceInfo = navigator.userAgent;
      let locationData = 'Unknown';
      try {
        const locRes = await fetch('https://ipapi.co/json/');
        const locJson = await locRes.json();
        // Format: "City, Region, Country (IP Address)"
        locationData = `${locJson.city}, ${locJson.region}, ${locJson.country_name} (${locJson.ip})`;
      } catch (err) {
        // Fallback to their timezone if the API fails or is blocked by an adblocker
        locationData = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }

      if (view === 'LOGIN') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        // 2. 🟢 Inject the captured data into our login log
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

        router.push('/docs')
        router.refresh()
      }
      else if (view === 'SIGNUP') {
        // 3. 🟢 Pass the captured data into Supabase's hidden user metadata!
        // The SQL trigger we wrote earlier will automatically catch this and log it.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              device_info: deviceInfo,
              location: locationData,
            }
          }
        })

        if (error) throw error
        setMessage({ type: 'success', text: 'Success! You can now sign in.' })
        setView('LOGIN')
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
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {view === 'LOGIN' ? 'Welcome back' : view === 'SIGNUP' ? 'Create an account' : 'Reset Password'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === 'LOGIN' ? 'Enter your credentials to access the vault.' :
              view === 'SIGNUP' ? 'Join the workspace.' :
                'Enter your email to receive a secure reset link.'}
          </p>
        </div>

        {message && (
          <div className={`mb-6 animate-in fade-in slide-in-from-top-2 rounded-lg p-4 text-sm font-medium ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-green-500/15 text-green-600 dark:text-green-400'
            }`}>
            {message.text}
          </div>
        )}

        {/* GitHub Button (Hidden during password reset) */}
        {view !== 'FORGOT_PASSWORD' && (
          <>
            <Button variant="outline" type="button" onClick={handleGitHub} className="flex w-full items-center justify-center gap-2 h-11">
              <GithubIcon /> Continue with GitHub
            </Button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase text-muted-foreground">Or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <input
              type="email" name="email" required
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {view !== 'FORGOT_PASSWORD' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                {view === 'LOGIN' && (
                  <button type="button" onClick={() => { setView('FORGOT_PASSWORD'); setMessage(null); }} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password" name="password" required
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <Button type="submit" className="mt-2 h-11" disabled={loading}>
            {loading ? 'Processing...' : view === 'LOGIN' ? 'Sign In' : view === 'SIGNUP' ? 'Sign Up' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Bottom Toggle */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {view === 'LOGIN' ? "Don't have an account? " : view === 'SIGNUP' ? "Already have an account? " : "Remember your password? "}
          <button
            type="button"
            onClick={() => { setView(view === 'SIGNUP' ? 'LOGIN' : view === 'FORGOT_PASSWORD' ? 'LOGIN' : 'SIGNUP'); setMessage(null); }}
            className="font-semibold text-primary hover:underline"
          >
            {view === 'LOGIN' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

function GithubIcon() { return <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> }