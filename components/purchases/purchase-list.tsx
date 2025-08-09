import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPurchases } from "@/lib/data/purchases"
import { DeletePurchaseDialog } from "./delete-purchase-dialog"

export async function PurchaseList() {
  const { data: purchases, error } = await getPurchases()

  if (error) {
    return <div className="text-red-500">Error loading purchases: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Purchases</CardTitle>
        <Link href="/purchases/new">
          <Button size="sm" className="h-8 gap-1">
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Purchase</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {purchases && purchases.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.products?.name}</TableCell>
                  <TableCell>{purchase.suppliers?.name}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/purchases/${purchase.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeletePurchaseDialog purchaseId={purchase.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardDescription>No purchases found. Add a new purchase to get started.</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
