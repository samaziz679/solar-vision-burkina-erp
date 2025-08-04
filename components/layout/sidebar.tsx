"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DollarSign, Users, Package, ShoppingCart, Truck, Banknote, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Banking", href: "/banking", icon: Banknote },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Expenses", href: "/expenses", icon: DollarSign },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Purchases", href: "/purchases", icon: ShoppingCart },
    { name: "Sales", href: "/sales", icon: Truck },
    { name: "Suppliers", href: "/suppliers", icon: Users },
  ]

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Failed to log out.", {
        description: error.message,
      })
    } else {
      toast.success("Logged out successfully.")
      router.push("/login")
    }
  }

  return (
    <div className="hidden border-r bg-background/95 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <Image src="/placeholder-logo.png" alt="Solar Vision ERP Logo" width={24} height={24} className="h-6 w-6" />
            <span className="">Solar Vision ERP</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start gap-2 px-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(item.href) && "bg-muted text-primary",
                )}
                href={item.href}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
