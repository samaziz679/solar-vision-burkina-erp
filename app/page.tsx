import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function HomePage() {
  try {
    // Try to create a Supabase client to check if env vars are available
    await createServerClient()
    redirect("/dashboard")
  } catch (error) {
    // If Supabase client creation fails, redirect to setup page
    redirect("/setup-required")
  }
}
