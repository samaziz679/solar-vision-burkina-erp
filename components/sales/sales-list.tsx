"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Sale } from "@/lib/supabase/types"
import DeleteSaleDialog from "./delete-sale-dialog"

interface SalesListProps {
  sales: Sale[]
}

export default function SalesList({ sales }: SalesListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedSaleId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Prix Unitaire</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Date de Vente</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.products?.name || "N/A"}</TableCell>
              <TableCell>{sale.clients?.name || "N/A"}</TableCell>
              <TableCell>{sale.quantity}</TableCell>
              <TableCell>{sale.unit_price.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>{sale.total_amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>{new Date(sale.sale_date).toLocaleDateString("fr-FR")}</TableCell>
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
                      <Link href={`/sales/${sale.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(sale.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSaleId && (
        <DeleteSaleDialog saleId={selectedSaleId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
