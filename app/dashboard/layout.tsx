import type React from "react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()

  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar user={user} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {children}
        <Toaster />
      </div>
    </div>
  )
}
