import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // This check ensures the client is only created in the browser environment
  // and that the necessary environment variables are present.
  if (
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // In a server-side rendering (SSR) or static generation context,
    // these environment variables might not be available or the client
    // should not be initialized.
    console.warn(
      "Supabase client not initialized: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY, or not in browser environment.",
    )
    return null as any // Return null or handle this case as appropriate for your application
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
