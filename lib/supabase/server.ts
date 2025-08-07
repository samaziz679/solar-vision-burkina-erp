import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically caused by an attempt to set a cookie from a Client Component.
            // Many of the Supabase client methods are designed to work from Server Components.
            // If you need to set cookies from a Client Component, you can use the `useCookies` hook from `next-client-cookies`.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().delete()` method can only be called from a Server Component or Server Action.
            // This error is typically caused by an attempt to delete a cookie from a Client Component.
            // Many of the Supabase client methods are designed to work from Server Components.
            // If you need to delete cookies from a Client Component, you can use the `useCookies` hook from `next-client-cookies`.
          }
        },
      },
    }
  )
}
