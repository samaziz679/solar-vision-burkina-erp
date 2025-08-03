"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import DeletePurchaseDialog from "./delete-purchase-dialog"
import type { Purchase } from "@/lib/supabase/types"
import { format } from "date-fns"

interface PurchaseListProps {
  purchases: Purchase[]
}

export default function PurchaseList({ purchases }: PurchaseListProps) {
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
            <TableHead>Date d'achat</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Statut de Paiement</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{format(new Date(purchase.purchase_date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{purchase.supplier_id || "N/A"}</TableCell> {/* Replace with actual supplier name */}
              <TableCell>
                {purchase.total_amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>{purchase.payment_status}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/purchases/${purchase.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(purchase.id)}>Supprimer</DropdownMenuItem>
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
