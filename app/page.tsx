import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect("/dashboard")
  }

  return redirect("/login")
}
