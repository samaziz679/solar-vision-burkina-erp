"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  Truck,
  Banknote,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Failed to sign out.")
      console.error("Error signing out:", error.message)
    } else {
      toast.success("Signed out successfully!")
      window.location.href = "/login" // Redirect to login page
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/banking", icon: Banknote, label: "Banking" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/expenses", icon: DollarSign, label: "Expenses" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/purchases", icon: ShoppingCart, label: "Purchases" },
    { href: "/sales", icon: Receipt, label: "Sales" },
    { href: "/suppliers", icon: Truck, label: "Suppliers" },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <Image src="/placeholder-logo.png" alt="Solar Vision ERP Logo" width={40} height={40} className="mr-2" />
        <h1 className="text-2xl font-bold">Solar Vision ERP</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center p-2 rounded-md text-lg font-medium transition-colors hover:bg-gray-700",
              pathname === item.href ? "bg-gray-700 text-primary-foreground" : "text-gray-300",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center p-2 rounded-md text-lg font-medium transition-colors hover:bg-gray-700",
            pathname === "/settings" ? "bg-gray-700 text-primary-foreground" : "text-gray-300",
          )}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
        <Button
          onClick={handleSignOut}
          className="w-full flex items-center justify-start p-2 rounded-md text-lg font-medium transition-colors hover:bg-gray-700 text-gray-300 bg-transparent"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
