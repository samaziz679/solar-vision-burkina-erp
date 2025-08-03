"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import DeleteSaleDialog from "./delete-sale-dialog"
import type { Sale } from "@/lib/supabase/types"
import { format } from "date-fns"

interface SalesListProps {
  sales: Sale[]
}

export default function SalesList({ sales }: SalesListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date de vente</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Statut de Paiement</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(new Date(sale.sale_date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{sale.client_id || "N/A"}</TableCell> {/* Replace with actual client name */}
              <TableCell>{sale.total_amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>{sale.payment_status}</TableCell>
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
                      <Link href={`/sales/${sale.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(sale.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedSaleId && (
        <DeleteSaleDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} saleId={selectedSaleId} />
      )}
    </>
  )
}
