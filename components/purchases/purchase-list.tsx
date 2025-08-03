"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PurchaseWithDetails } from "@/lib/data/purchases"
import DeletePurchaseDialog from "./delete-purchase-dialog"

interface PurchaseListProps {
  purchases: PurchaseWithDetails[]
}

export default function PurchaseList({ purchases }: PurchaseListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedPurchaseId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedPurchaseId(null)
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun achat trouvé.</p>
        <p className="text-sm mt-1">Ajoutez votre premier achat pour commencer.</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Coût Unitaire</TableHead>
            <TableHead>Coût Total</TableHead>
            <TableHead>Statut Paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{format(new Date(purchase.purchase_date), "dd MMMM yyyy", { locale: fr })}</TableCell>
              <TableCell>{purchase.products?.name || "N/A"}</TableCell>
              <TableCell>{purchase.suppliers?.name || "N/A"}</TableCell>
              <TableCell>{purchase.quantity_purchased}</TableCell>
              <TableCell>
                {purchase.unit_cost.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {purchase.total_cost.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                <Badge variant={purchase.payment_status === "paid" ? "default" : "secondary"}>
                  {purchase.payment_status === "paid"
                    ? "Payé"
                    : purchase.payment_status === "pending"
                      ? "En attente"
                      : "Partiellement payé"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/purchases/${purchase.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(purchase.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
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
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}

export function PurchaseListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-4">
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-8 gap-4">
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
        </div>
      ))}
    </div>
  )
}
