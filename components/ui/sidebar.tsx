"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Users, DollarSign, Banknote, Truck, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// This file is intentionally left empty or minimal as the actual Sidebar
// component is expected to be in `components/layout/sidebar.tsx`
// and this `components/ui/sidebar.tsx` might be a placeholder or
// a remnant from a previous shadcn/ui setup.
// If you intend to use a shadcn/ui sidebar, you would typically
// generate it using `npx shadcn@latest add sidebar` and its content
// would be here.
// For this project, the functional sidebar is in `components/layout/sidebar.tsx`.

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Error signing out: " + error.message)
    } else {
      toast.success("Signed out successfully!")
      window.location.href = "/login" // Redirect to login page
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/purchases", icon: Truck, label: "Purchases" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/suppliers", icon: DollarSign, label: "Suppliers" },
    { href: "/expenses", icon: Banknote, label: "Expenses" },
    { href: "/banking", icon: Banknote, label: "Banking" },
  ]

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background p-4">
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname === item.href && "bg-muted hover:bg-muted")}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", pathname === "/settings" && "bg-muted hover:bg-muted")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
