"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Banknote,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import type { UserRole } from "@/lib/supabase/types"

interface SidebarProps {
  userRoles: UserRole[]
}

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "stock_manager", "commercial", "finance", "visitor", "seller"],
  },
  {
    title: "Inventaire",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "stock_manager"],
  },
  {
    title: "Ventes",
    href: "/sales",
    icon: ShoppingCart,
    roles: ["admin", "commercial", "seller"],
  },
  {
    title: "Achats",
    href: "/purchases",
    icon: TrendingUp,
    roles: ["admin", "stock_manager"],
  },
  {
    title: "Dépenses",
    href: "/expenses",
    icon: CreditCard,
    roles: ["admin", "finance"],
  },
  {
    title: "Banque",
    href: "/banking",
    icon: Banknote,
    roles: ["admin", "finance"],
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Fournisseurs",
    href: "/suppliers",
    icon: Users, // You can choose a different icon if you prefer, e.g., Truck or Factory
    roles: ["admin", "stock_manager", "visitor"],
  },
]

export default function Sidebar({ userRoles }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const hasAccess = (requiredRoles: string[]) => {
    return requiredRoles.some((role) => userRoles.includes(role as UserRole))
  }

  const filteredMenuItems = menuItems.filter((item) => hasAccess(item.roles))

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="font-bold text-lg">Solar Vision</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3 text-xs text-gray-500">Rôles: {userRoles.join(", ")}</div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
</merged_code>
