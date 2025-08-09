import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getSales } from "@/lib/data/sales"
import { DeleteSaleDialog } from "./delete-sale-dialog"

export async function SalesList() {
  const { data: sales, error } = await getSales()

  if (error) {
    return <div className="text-red-500">Error loading sales: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sales</CardTitle>
        <Link href="/sales/new">
          <Button size="sm" className="h-8 gap-1">
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Sale</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {sales && sales.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.products?.name}</TableCell>
                  <TableCell>{sale.clients?.name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${sale.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/sales/${sale.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeleteSaleDialog saleId={sale.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardDescription>No sales found. Add a new sale to get started.</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
