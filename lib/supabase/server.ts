import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        try {
          cookieStore.set(name, value, options)
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This error is typically not a problem if you're only using it for authentication,
          // as the session will be refreshed on the next request.
          console.warn("Failed to set cookie:", error)
        }
      },
      remove: (name: string, options: any) => {
        try {
          cookieStore.set(name, "", options)
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This error is typically not a problem if you're only using it for authentication,
          // as the session will be refreshed on the next request.
          console.warn("Failed to remove cookie:", error)
        }
      },
    },
  })
}
