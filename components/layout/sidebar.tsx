"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import {
  HomeIcon,
  Package2Icon,
  ShoppingCartIcon,
  UsersIcon,
  LineChartIcon,
  BanknoteIcon,
  TruckIcon,
  ReceiptTextIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface SidebarProps {
  user: User | null
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté.",
      })
      router.push("/login")
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2Icon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Solar Vision Burkina ERP</span>
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
                <HomeIcon className="h-5 w-5" />
                <span className="sr-only">Tableau de Bord</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tableau de Bord</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/inventory"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/inventory") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Package2Icon className="h-5 w-5" />
                <span className="sr-only">Inventaire</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inventaire</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/sales"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/sales") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
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
                <TruckIcon className="h-5 w-5" />
                <span className="sr-only">Achats</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Achats</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/clients"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname.startsWith("/clients") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <UsersIcon className="h-5 w-5" />
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
                <ReceiptTextIcon className="h-5 w-5" />
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
                <LineChartIcon className="h-5 w-5" />
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
                <BanknoteIcon className="h-5 w-5" />
                <span className="sr-only">Opérations Bancaires</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Opérations Bancaires</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Se déconnecter"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Se déconnecter</TooltipContent>
          </Tooltip>
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <Image
                    src={user.user_metadata.avatar_url || "/placeholder-user.jpg"}
                    width={32}
                    height={32}
                    alt="Avatar"
                    className="rounded-full"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profil</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </nav>
    </aside>
  )
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="17 16 22 12 17 8" />
      <line x1="22" x2="10" y1="12" y2="12" />
    </svg>
  )
}
