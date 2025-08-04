"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, ShoppingCart, Package, Users, Truck, Banknote, LogOut, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Failed to sign out", { description: error.message })
    } else {
      router.push("/login")
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/sales", icon: DollarSign, label: "Sales" },
    { href: "/purchases", icon: ShoppingCart, label: "Purchases" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/suppliers", icon: Truck, label: "Suppliers" },
    { href: "/expenses", icon: Banknote, label: "Expenses" },
    { href: "/banking", icon: Banknote, label: "Banking" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full border-r bg-background p-4">
        <div className="flex items-center justify-center h-16 border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <img src="/placeholder-logo.svg" alt="Solar Vision ERP Logo" className="h-6 w-6" />
            <span>Solar Vision ERP</span>
          </Link>
        </div>
        <nav className="flex-1 grid items-start gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === item.href ? "bg-muted text-primary" : ""
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname === "/settings" ? "bg-muted text-primary" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button variant="ghost" className="w-full justify-start mt-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <header className="flex md:hidden h-16 items-center gap-4 border-b bg-background px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                <img src="/placeholder-logo.svg" alt="Solar Vision ERP Logo" className="h-6 w-6" />
                <span>Solar Vision ERP</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                    pathname === item.href ? "bg-muted text-foreground" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t">
              <Link
                href="/settings"
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  pathname === "/settings" ? "bg-muted text-foreground" : ""
                }`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Button variant="ghost" className="w-full justify-start mt-2 mx-[-0.65rem]" onClick={handleSignOut}>
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <img src="/placeholder-logo.svg" alt="Solar Vision ERP Logo" className="h-6 w-6" />
          <span>Solar Vision ERP</span>
        </Link>
      </header>
    </>
  )
}
