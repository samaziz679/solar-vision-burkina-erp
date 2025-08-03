"use client"

import Link from "next/link"
import { DollarSign, Home, Package, ShoppingCart, Users, Package2, Menu, Banknote, Truck, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SidebarProps {
  user: User | null
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Échec de la déconnexion.", {
        description: error.message,
      })
    } else {
      toast.success("Déconnexion réussie.")
      router.push("/login")
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Tableau de Bord" },
    { href: "/inventory", icon: Package, label: "Inventaire" },
    { href: "/sales", icon: ShoppingCart, label: "Ventes" },
    { href: "/purchases", icon: DollarSign, label: "Achats" },
    { href: "/expenses", icon: Banknote, label: "Dépenses" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/suppliers", icon: Truck, label: "Fournisseurs" },
  ]

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background">
        <div className="border-b p-2">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <span className="sr-only">Solar Vision Burkina</span>
            SVB
          </Link>
        </div>
        <nav className="grid gap-1 p-2">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Déconnexion</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Déconnexion</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Solar Vision Burkina ERP</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.href === "/inventory" && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">10</Badge>
                  )}
                </Link>
              ))}
              {user ? (
                <Button variant="ghost" className="flex items-center gap-4 px-2.5" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </Button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Connexion
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </TooltipProvider>
  )
}
