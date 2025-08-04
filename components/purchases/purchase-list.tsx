"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { DeletePurchaseDialog } from "./delete-purchase-dialog"
import type { Purchase } from "@/lib/supabase/types"

interface PurchaseListProps {
  purchases: Purchase[]
}

export function PurchaseList({ purchases }: PurchaseListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedPurchaseId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.suppliers?.name || "N/A"}</TableCell>
              <TableCell>{purchase.products?.name || "N/A"}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>{formatCurrency(purchase.unit_price)}</TableCell>
              <TableCell>{formatCurrency(purchase.quantity * purchase.unit_price)}</TableCell>
              <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
              <TableCell>{purchase.notes}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/purchases/${purchase.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(purchase.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPurchaseId && (
        <DeletePurchaseDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          purchaseId={selectedPurchaseId}
        />
      )}
    </>
  )
}
