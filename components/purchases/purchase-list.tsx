"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { PurchaseWithDetails } from "@/lib/data/purchases"
import DeletePurchaseDialog from "./delete-purchase-dialog" // Will be created next

interface PurchaseListProps {
  purchases: PurchaseWithDetails[]
}

export default function PurchaseList({ purchases: initialPurchases }: PurchaseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [purchases, setPurchases] = useState(initialPurchases)

  useState(() => {
    setPurchases(initialPurchases)
  }, [initialPurchases])

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.suppliers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePurchaseDelete = (deletedPurchaseId: string) => {
    setPurchases((prevPurchases) => prevPurchases.filter((p) => p.id !== deletedPurchaseId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Liste des achats
        </CardTitle>
        <CardDescription>Historique de tous les achats enregistrés.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un achat (produit, fournisseur, notes)..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun achat trouvé.</p>
            <p className="text-sm mt-1">Essayez d'ajuster votre recherche ou enregistrez de nouveaux achats.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix Unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.purchase_date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{purchase.products?.name || "N/A"}</TableCell>
                    <TableCell>{purchase.suppliers?.name || "Fournisseur Inconnu"}</TableCell>
                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                    <TableCell className="text-right">{purchase.unit_price.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">{purchase.total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-sm text-gray-500">{purchase.notes || "-"}</TableCell>
                    <TableCell className="text-center flex items-center justify-center gap-1">
                      <Link href={`/purchases/${purchase.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </Link>
                      <DeletePurchaseDialog
                        purchaseId={purchase.id}
                        productName={purchase.products?.name || "Produit Inconnu"}
                        onDeleteSuccess={() => handlePurchaseDelete(purchase.id)}
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

