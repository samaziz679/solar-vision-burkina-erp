import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const envs = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  let auth = { hasUser: false, error: null as string | null }

  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    auth = { hasUser: !!data?.user, error: error?.message ?? null }
  } catch (e: any) {
    auth = { hasUser: false, error: e?.message ?? "auth check failed" }
  }

  return NextResponse.json({ envs, auth }, { status: 200 })
}
