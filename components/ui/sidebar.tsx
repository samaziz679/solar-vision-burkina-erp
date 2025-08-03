"use client"

import React from "react"

import Link from "next/link"
import { DollarSign, Home, Package, ShoppingCart, Users, Package2, Menu, Banknote, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: User | null
}

const SidebarComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex", className)}
      {...props}
    >
      {/* SidebarHeader Component */}
    </div>
  ),
)
SidebarComponent.displayName = "SidebarComponent"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 overflow-auto p-4", className)} {...props} />,
)
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-end p-4", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

export { SidebarComponent as Sidebar, SidebarHeader, SidebarBody, SidebarFooter }

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      })
    } else {
      router.push("/login")
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/purchases", icon: Truck, label: "Purchases" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/suppliers", icon: Truck, label: "Suppliers" },
    { href: "/expenses", icon: DollarSign, label: "Expenses" },
    { href: "/banking", icon: Banknote, label: "Banking" },
  ]

  return (
    <div className="flex">
      <SidebarComponent>
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Solar Vision Burkina ERP</span>
          </Link>
        </SidebarHeader>
        <SidebarBody>
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-2.5",
                      pathname.startsWith(item.href) && "text-foreground",
                      !pathname.startsWith(item.href) && "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.href === "/inventory" && (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        10
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </SidebarBody>
        <SidebarFooter>
          {user ? (
            <Button variant="ghost" className="flex items-center gap-4 px-2.5" onClick={handleLogout}>
              <DollarSign className="h-5 w-5" />
              Déconnexion
            </Button>
          ) : (
            <Link href="/login" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
              <DollarSign className="h-5 w-5" />
              Connexion
            </Link>
          )}
        </SidebarFooter>
      </SidebarComponent>
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
              <TooltipProvider>
                {navItems.map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-2.5",
                          pathname.startsWith(item.href) && "text-foreground",
                          !pathname.startsWith(item.href) && "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        {item.href === "/inventory" && (
                          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            10
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
              {user ? (
                <Button variant="ghost" className="flex items-center gap-4 px-2.5" onClick={handleLogout}>
                  <DollarSign className="h-5 w-5" />
                  Déconnexion
                </Button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <DollarSign className="h-5 w-5" />
                  Connexion
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  )
}

export default Sidebar
