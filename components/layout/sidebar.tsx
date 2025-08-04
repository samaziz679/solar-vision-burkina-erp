"use client"

import Link from "next/link"
import { Package2, Home, DollarSign, Users, Package, Banknote, ShoppingBag, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Solar Vision ERP</span>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Tableau de Bord</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tableau de Bord</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/sales"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/sales") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <DollarSign className="h-5 w-5" />
                <span className="sr-only">Ventes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Ventes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/purchases"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/purchases") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Achats</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Achats</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/inventory"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/inventory") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Inventaire</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inventaire</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/clients"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/clients") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">Clients</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Clients</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/suppliers"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/suppliers") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">Fournisseurs</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Fournisseurs</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/expenses"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/expenses") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Banknote className="h-5 w-5" />
                <span className="sr-only">Dépenses</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dépenses</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/banking"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/banking") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Banknote className="h-5 w-5" />
                <span className="sr-only">Comptes Bancaires</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Comptes Bancaires</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/settings") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Paramètres</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Paramètres</TooltipContent>
          </Tooltip>
          {user ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-log-out h-5 w-5"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="17 16 22 12 17 8" />
                    <line x1="22" x2="10" y1="12" y2="12" />
                  </svg>
                  <span className="sr-only">Déconnexion</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Déconnexion</TooltipContent>
            </Tooltip>
          ) : null}
        </TooltipProvider>
      </nav>
    </aside>
  )
}
