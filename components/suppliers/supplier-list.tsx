"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, Pencil } from "lucide-react" // Using Users icon for now, can change later
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Supplier } from "@/lib/supabase/types"
import DeleteSupplierDialog from "./delete-supplier-dialog" // Will be created later

interface SupplierListProps {
  suppliers: Supplier[]
}

export default function SupplierList({ suppliers: initialSuppliers }: SupplierListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliers, setSuppliers] = useState(initialSuppliers)

  // Update suppliers state when initialSuppliers prop changes (e.g., after revalidation)
  useState(() => {
    setSuppliers(initialSuppliers)
  }, [initialSuppliers])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSupplierDelete = (deletedSupplierId: string) => {
    setSuppliers((prevSuppliers) => prevSuppliers.filter((s) => s.id !== deletedSupplierId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> {/* Consider a more specific icon for suppliers if available */}
          Liste des fournisseurs
        </CardTitle>
        <CardDescription>Gérez votre base de données fournisseurs.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un fournisseur (nom, téléphone, email)..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun fournisseur trouvé.</p>
            <p className="text-sm mt-1">Essayez d'ajuster votre recherche ou ajoutez de nouveaux fournisseurs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.phone || "-"}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.address || "-"}</TableCell>
                    <TableCell className="text-center flex items-center justify-center gap-1">
                      <Link href={`/suppliers/${supplier.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </Link>
                      <DeleteSupplierDialog
                        supplierId={supplier.id}
                        supplierName={supplier.name}
                        onDeleteSuccess={() => handleSupplierDelete(supplier.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
