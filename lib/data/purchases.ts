import { createServerClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { CookieOptions } from "types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createClient = () => {
  const cookieStore = cookies()
  const get = (key: string) => cookieStore.get(key)?.value || ""
  const set = (key: string, value: string, options: CookieOptions) => {
    cookieStore.set(key, value, options)
  }
  const remove = (key: string) => {
    cookieStore.delete(key)
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get,
      set,
      remove,
    },
  })
}
