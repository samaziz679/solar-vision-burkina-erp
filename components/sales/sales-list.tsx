"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SaleWithDetails } from "@/lib/data/sales"
import DeleteSaleDialog from "./delete-sale-dialog"

interface SalesListProps {
  sales: SaleWithDetails[]
}

export default function SalesList({ sales }: SalesListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedSaleId(null)
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune vente trouvée.</p>
        <p className="text-sm mt-1">Ajoutez votre première vente pour commencer.</p>
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
            <TableHead>Client</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Prix Unitaire</TableHead>
            <TableHead>Prix Total</TableHead>
            <TableHead>Statut Paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(new Date(sale.sale_date), "dd MMMM yyyy", { locale: fr })}</TableCell>
              <TableCell>{sale.products?.name || "N/A"}</TableCell>
              <TableCell>{sale.clients?.name || "N/A"}</TableCell>
              <TableCell>{sale.quantity_sold}</TableCell>
              <TableCell>{sale.unit_price.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>{sale.total_price.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>
                <Badge variant={sale.payment_status === "paid" ? "default" : "secondary"}>
                  {sale.payment_status === "paid"
                    ? "Payé"
                    : sale.payment_status === "pending"
                      ? "En attente"
                      : "Partiellement payé"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/sales/${sale.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(sale.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedSaleId && (
        <DeleteSaleDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          saleId={selectedSaleId}
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}

export function SalesListSkeleton() {
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
