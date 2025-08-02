import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export function createClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // These logs are crucial for debugging
  console.log(
    "DEBUG: Server Supabase URL:",
    supabaseUrl ? "Set" : "Not Set",
    supabaseUrl ? "Length: " + supabaseUrl.length : "N/A",
  )
  console.log(
    "DEBUG: Server Supabase Anon Key:",
    supabaseAnonKey ? "Set" : "Not Set",
    supabaseAnonKey ? "Length: " + supabaseAnonKey.length : "N/A",
  )

  if (!supabaseUrl || !supabaseAnonKey) {
    // Throw a more explicit error if env vars are missing
    throw new Error(
      "Supabase environment variables are missing or invalid. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set in Vercel.",
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This error is typically ignored if we're in a Client Component.
          // console.warn("Could not set cookie from server component:", error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This error is typically ignored if we're in a Client Component.
          // console.warn("Could not remove cookie from server component:", error);
        }
      },
    },
  })
}
