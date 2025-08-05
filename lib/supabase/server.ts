import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Ensure server-side environment variables are available.
  // This check is crucial for server components and API routes.
  if (!supabaseUrl || !serviceRoleKey) {
    // Log a warning or throw an error if critical environment variables are missing.
    // This helps in debugging deployment issues.
    console.error("Missing Supabase environment variables in lib/supabase/server.ts")
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined for server-side operations.")
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The cookies().set() method can only be called in a Server Action or Route Handler.
          // This error is typically ignored if we're just reading cookies in a Server Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          // Same as above, typically ignored if just reading.
        }
      },
    },
  })
}
