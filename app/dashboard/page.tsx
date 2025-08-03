import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Users } from "lucide-react"
import { getDashboardData } from "@/lib/data/dashboard"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // This case should ideally be handled by middleware or layout redirect
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-muted-foreground">Veuillez vous connecter pour voir le tableau de bord.</p>
      </div>
    )
  }

  const { totalSales, totalExpenses, totalProducts, totalClients, error } = await getDashboardData(user.id)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-destructive">
          Erreur lors du chargement des données du tableau de bord: {error.message}
        </p>
      </div>
    )
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="font-semibold text-lg md:text-2xl">Tableau de Bord</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSales?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" }) || "0 XOF"}
            </div>
            <p className="text-xs text-muted-foreground">Basé sur toutes les ventes enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" }) || "0 XOF"}
            </div>
            <p className="text-xs text-muted-foreground">Basé sur toutes les dépenses enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts?.toLocaleString("fr-FR") || "0"}</div>
            <p className="text-xs text-muted-foreground">Nombre total de produits uniques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients?.toLocaleString("fr-FR") || "0"}</div>
            <p className="text-xs text-muted-foreground">Nombre total de clients enregistrés</p>
          </CardContent>
        </Card>
      </div>
      {/* You can add more dashboard components here, e.g., recent sales, low stock alerts */}
    </main>
  )
}
