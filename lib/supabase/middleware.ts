import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { NextRequest, NextResponse } from "next/server"

export const createClient = (request: NextRequest, response: NextResponse) => {
  return createMiddlewareClient({ req: request, res: response })
}
