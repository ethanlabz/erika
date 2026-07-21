import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Await the asynchronous cookies object (Next.js 15+ requirement)
  const cookieStore = await cookies()

  // 🕒 SET YOUR TIMEOUT HERE (in seconds)
  // 3600 = 1 hour | 7200 = 2 hours | 86400 = 1 day
  const STRICT_SESSION_TIMEOUT = 86400

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // We spread the original options, but explicitly overwrite maxAge
              cookieStore.set(name, value, { 
                ...options, 
                maxAge: STRICT_SESSION_TIMEOUT 
              })
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}