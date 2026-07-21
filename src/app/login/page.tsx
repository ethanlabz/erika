import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function LoginPage({ 
  searchParams 
}: { 
  // 1. Update the type to reflect that searchParams is a Promise
  searchParams: Promise<{ error?: string }> 
}) {
  // 2. Await the params before trying to read `.error`
  const resolvedSearchParams = await searchParams;
  
  // Next.js Server Action
  const logIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) redirect('/login?error=true')
    redirect('/docs')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Secure Access</h2>
        
        {resolvedSearchParams?.error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            Invalid email or password.
          </div>
        )}

        <form action={logIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" name="email" required 
              className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input 
              type="password" name="password" required 
              className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <Button type="submit" className="mt-2 w-full">Sign In</Button>
        </form>
      </div>
    </div>
  )
}