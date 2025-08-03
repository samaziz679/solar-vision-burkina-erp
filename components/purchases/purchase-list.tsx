"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Purchase } from "@/lib/supabase/types"
import DeletePurchaseDialog from "./delete-purchase-dialog"

interface PurchaseListProps {
  purchases: Purchase[]
}

export default function PurchaseList({ purchases }: PurchaseListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedPurchaseId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedPurchaseId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Coût Unitaire</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Date d&apos;achat</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.products?.name || "N/A"}</TableCell>
              <TableCell>{purchase.suppliers?.name || "N/A"}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>
                {purchase.unit_cost.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {purchase.total_amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>{new Date(purchase.purchase_date).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/purchases/${purchase.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(purchase.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPurchaseId && (
        <DeletePurchaseDialog purchaseId={selectedPurchaseId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
