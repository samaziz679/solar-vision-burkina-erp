import { createServerClient } from "@supabase/supabase-js"
import { type CookieOptions, cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const serverClient = createServerClient(supabaseUrl, supabaseKey, {
  cookies: {
    get(name: string) {
      return cookies().get(name)?.value
    },
    set(name: string, value: string, options: CookieOptions) {
      cookies().set(name, value, options)
    },
    remove(name: string, options: CookieOptions) {
      cookies().delete(name, options)
    },
  },
})

// /** rest of code here **/
