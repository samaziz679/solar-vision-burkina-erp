import { getCurrentUser, getUserRoles } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, AlertTriangle, DollarSign } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const userRoles = await getUserRoles(user!.id)

  const stats = [
    {
      title: "Chiffre d'affaires",
      value: "0 FCFA",
      description: "Ce mois",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ventes",
      value: "0",
      description: "Aujourd'hui",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Produits",
      value: "0",
      description: "En stock",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Stock faible",
      value: "0",
      description: "Alertes",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, {user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {userRoles.map((role) => (
            <Badge key={role} variant="secondary">
              {role.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userRoles.includes("seller") || userRoles.includes("commercial") || userRoles.includes("admin") ? (
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Nouvelle vente</h3>
                    <p className="text-sm text-gray-600">Enregistrer une vente</p>
                  </div>
                </div>
              </div>
            ) : null}

            {userRoles.includes("stock_manager") || userRoles.includes("admin") ? (
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Gérer l'inventaire</h3>
                    <p className="text-sm text-gray-600">Ajouter ou modifier des produits</p>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune activité récente</p>
              <p className="text-sm mt-1">Les actions apparaîtront ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
