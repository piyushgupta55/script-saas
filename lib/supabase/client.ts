import { createBrowserClient } from '@supabase/ssr'

export function createClient(type: 'user' | 'admin' = 'user') {
  const cookieName = type === 'admin' ? 'sb-admin-auth' : 'sb-user-auth'
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: cookieName,
        maxAge: 60 * 60 * 24 * 365,
      }
    }
  )
}
