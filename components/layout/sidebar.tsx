"use client"

import Link from "next/link"
import Image from "next/image"
import { Home, Package, ShoppingCart, Users2, LineChart, Banknote, Truck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-provider"
import { UserNav } from "@/components/layout/user-nav"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useActionState } from "react"
import { logout } from "@/lib/auth" // Declare the logout variable

interface AppSidebarProps {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const supabase = createClient()
  const [state, formAction, isPending] = useActionState(logout, undefined)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        toggleSidebar(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, toggleSidebar])

  const handleLinkClick = async (path: string) => {
    if (window.innerWidth < 768) {
      toggleSidebar(false)
    }
    // Update sidebar state in cookie
    await supabase.from("users").update({ sidebar_open: isOpen }).eq("id", "current_user_id") // Replace with actual user ID
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/purchases", icon: Truck, label: "Purchases" },
    { href: "/clients", icon: Users2, label: "Clients" },
    { href: "/suppliers", icon: Users2, label: "Suppliers" },
    { href: "/expenses", icon: LineChart, label: "Expenses" },
    { href: "/banking", icon: Banknote, label: "Banking" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden border-r bg-muted/40 md:block transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Image
                src="/placeholder-logo.png"
                width={32}
                height={32}
                alt="Solar Vision Burkina ERP Logo"
                className="rounded-full"
              />
              <span className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
                Solar Vision
              </span>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden lg:block" onClick={() => toggleSidebar()}>
              <Home className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    { "bg-muted text-primary": pathname === item.href },
                  )}
                  onClick={() => handleLinkClick(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 flex items-center justify-center gap-2">
            <ThemeToggle />
            <UserNav user={user} />
            <form action={formAction}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                disabled={isPending}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Home className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Image
                src="/placeholder-logo.png"
                width={32}
                height={32}
                alt="Solar Vision Burkina ERP Logo"
                className="rounded-full"
              />
              <span className="sr-only">Solar Vision Burkina ERP</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleLinkClick(item.href)}
              >
                {item.label}
              </Link>
            ))}
            <form action={formAction}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                disabled={isPending}
              >
                Logout
              </Button>
            </form>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
