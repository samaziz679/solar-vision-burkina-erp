"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Supplier } from "@/lib/supabase/types"
import DeleteSupplierDialog from "./delete-supplier-dialog"

interface SupplierListProps {
  suppliers: Supplier[]
}

export default function SupplierList({ suppliers }: SupplierListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedSupplierId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedSupplierId(null)
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun fournisseur trouvé.</p>
        <p className="text-sm mt-1">Ajoutez votre premier fournisseur pour commencer.</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Personne Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/suppliers/${supplier.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(supplier.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedSupplierId && (
        <DeleteSupplierDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          supplierId={selectedSupplierId}
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}

export function SupplierListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-4">
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4">
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
