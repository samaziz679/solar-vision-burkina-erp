import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // These logs are crucial for debugging
  console.log(
    "DEBUG: Client Supabase URL:",
    supabaseUrl ? "Set" : "Not Set",
    supabaseUrl ? "Length: " + supabaseUrl.length : "N/A",
  )
  console.log(
    "DEBUG: Client Supabase Anon Key:",
    supabaseAnonKey ? "Set" : "Not Set",
    supabaseAnonKey ? "Length: " + supabaseAnonKey.length : "N/A",
  )

  if (!supabaseUrl || !supabaseAnonKey) {
    // Throw a more explicit error if env vars are missing
    throw new Error(
      "Supabase environment variables are missing or invalid. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set in Vercel.",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
