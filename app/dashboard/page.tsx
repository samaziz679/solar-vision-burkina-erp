import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/lib/data/products"
import { getSales } from "@/lib/data/sales"
import { getPurchases } from "@/lib/data/purchases"
import { getExpenses } from "@/lib/data/expenses"
import { getBankEntries } from "@/lib/data/banking"

export default async function DashboardPage() {
  const products = await getProducts()
  const sales = await getSales()
  const purchases = await getPurchases()
  const expenses = await getExpenses()
  const bankEntries = await getBankEntries()

  // Calculate total stock value
  const totalStockValue = products.reduce((sum, product) => {
    return sum + product.quantity * product.prix_achat
  }, 0)

  // Calculate total sales amount
  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total_amount, 0)

  // Calculate total purchases amount
  const totalPurchasesAmount = purchases.reduce((sum, purchase) => sum + purchase.total_amount, 0)

  // Calculate total expenses amount
  const totalExpensesAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate current bank balance
  const bankBalance = bankEntries.reduce((balance, entry) => {
    if (entry.type === "Dépôt") {
      return balance + entry.amount
    } else if (entry.type === "Retrait") {
      return balance - entry.amount
    }
    return balance
  }, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Totale du Stock</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalStockValue.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
          </div>
          <p className="text-xs text-muted-foreground">Basé sur le prix d'achat actuel</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
          <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalSalesAmount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
          </div>
          <p className="text-xs text-muted-foreground">Montant total des ventes enregistrées</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achats Totaux</CardTitle>
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalPurchasesAmount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
          </div>
          <p className="text-xs text-muted-foreground">Montant total des achats enregistrés</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalExpensesAmount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
          </div>
          <p className="text-xs text-muted-foreground">Total des dépenses enregistrées</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solde Bancaire Actuel</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bankBalance.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
          </div>
          <p className="text-xs text-muted-foreground">Solde net des opérations bancaires</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function BanknoteIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01" />
      <path d="M18 12h.01" />
    </svg>
  )
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
