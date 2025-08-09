import { createServerClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { CookieOptions } from "types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getServerClient = () => {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // No-op mutator
      },
      remove(name: string) {
        // No-op mutator
      },
    },
  })
}

// /** rest of code here **/
