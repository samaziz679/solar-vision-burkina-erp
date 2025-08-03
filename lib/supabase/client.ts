import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/types"

let supabase: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
      )
    }

    supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}
