import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can throw an error when called from a Server Component or Server Action that is called by a Client Component.
          // This is because the Server Component/Action already sent the HTTP response, and it's too late to set a cookie.
          // You can use the `useCookies` hook to set cookies from a Client Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `cookies().delete()` method can throw an error when called from a Server Component or Server Action that is called by a Client Component.
          // This is because the Server Component/Action already sent the HTTP response, and it's too late to set a cookie.
          // You can use the `useCookies` hook to delete cookies from a Client Component.
        }
      },
    },
  })
}
