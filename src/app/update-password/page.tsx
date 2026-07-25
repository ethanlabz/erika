'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 1. Verify passwords match before talking to the database
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      setLoading(false)
      return
    }

    // 2. Enforce minimum length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    // 3. Update the password for the currently active recovery session
    const { error: updateError } = await supabase.auth.updateUser({ password })
    
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push('/docs')
      router.refresh()
    }
  }

  // If they remember their password, destroy the recovery session and go back
  const handleCancel = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Secure your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please enter your new password below.</p>
        </div>
        
        {error && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 rounded-lg bg-destructive/15 p-4 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Enter a new password</label>
            <input 
              type="password" name="password" required minLength={6}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Re-enter the new password</label>
            <input 
              type="password" name="confirmPassword" required minLength={6}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleCancel}
              className="h-11 w-full text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              I remembered my password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}