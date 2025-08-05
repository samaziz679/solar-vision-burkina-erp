import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDashboardSummary,
  getRecentSales,
  getRecentPurchases,
  getTopSellingProducts,
  getExpenseCategoriesSummary,
} from "@/lib/data/dashboard"
import { DollarSign, ShoppingCart, Package, Banknote } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default async function DashboardPage() {
  const summary = await getDashboardSummary()
  const recentSales = await getRecentSales()
  const recentPurchases = await getRecentPurchases()
  const topSellingProducts = await getTopSellingProducts()
  const expenseCategories = await getExpenseCategoriesSummary()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalSales.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total revenue from all sales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalPurchases.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total cost of all purchases</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total operational expenses</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Banking Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalBankingBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Combined balance across all accounts</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalProductsInStock}</div>
          <p className="text-xs text-muted-foreground">Total quantity of all products</p>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{(sale.products as { name: string }).name}</TableCell>
                  <TableCell>{(sale.clients as { name: string }).name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${(sale.quantity * sale.unit_price).toFixed(2)}</TableCell>
                  <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{(purchase.products as { name: string }).name}</TableCell>
                  <TableCell>{(purchase.suppliers as { name: string }).name}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>${(purchase.quantity * purchase.unit_price).toFixed(2)}</TableCell>
                  <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Total Quantity Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSellingProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.totalQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Bar dataKey="totalAmount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
