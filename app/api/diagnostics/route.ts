import { debugFetchCardData } from "@/lib/data/dashboard"

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }

  const data = await debugFetchCardData()

  return Response.json({
    timestamp: new Date().toISOString(),
    env,
    data,
    note: "env flags indicate presence only. Sources show which view/table and column were used for each total. This route runs on the server.",
  })
}
