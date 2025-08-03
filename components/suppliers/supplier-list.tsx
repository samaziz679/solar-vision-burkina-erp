"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Supplier } from "@/lib/supabase/types"
import DeleteSupplierDialog from "./delete-supplier-dialog"

interface SupplierListProps {
  suppliers: Supplier[]
}

export default function SupplierList({ suppliers }: SupplierListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedSupplierId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedSupplierId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Personne de Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.contact_person}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.address}</TableCell>
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
                      <Link href={`/suppliers/${supplier.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(supplier.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSupplierId && (
        <DeleteSupplierDialog supplierId={selectedSupplierId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
