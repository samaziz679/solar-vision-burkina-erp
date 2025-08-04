import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function IndexPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  } else {
    redirect("/dashboard")
  }

  return null
}
