"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Package2,
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Receipt,
  Users,
  Truck,
  LineChart,
  LogOut,
} from "lucide-react"
import { logout } from "@/lib/auth"
import { useActionState } from "react-dom"

export function Sidebar() {
  const pathname = usePathname()
  const [state, formAction] = useActionState(logout, undefined)

  const navItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/banking",
      icon: DollarSign,
      label: "Banking",
    },
    {
      href: "/inventory",
      icon: Package2,
      label: "Inventory",
    },
    {
      href: "/purchases",
      icon: ShoppingCart,
      label: "Purchases",
    },
    {
      href: "/sales",
      icon: Receipt,
      label: "Sales",
    },
    {
      href: "/clients",
      icon: Users,
      label: "Clients",
    },
    {
      href: "/suppliers",
      icon: Truck,
      label: "Suppliers",
    },
    {
      href: "/expenses",
      icon: LineChart,
      label: "Expenses",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Solar Vision ERP</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <form action={formAction}>
            <Button type="submit" className="w-full" variant="secondary">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
