"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { SaleWithDetails } from "@/lib/data/sales" // Import the extended type
import DeleteSaleDialog from "./delete-sale-dialog" // Import the new component

interface SalesListProps {
  sales: SaleWithDetails[]
}

export default function SalesList({ sales: initialSales }: SalesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sales, setSales] = useState(initialSales)

  useState(() => {
    setSales(initialSales)
  }, [initialSales])

  const filteredSales = sales.filter(
    (sale) =>
      sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaleDelete = (deletedSaleId: string) => {
    setSales((prevSales) => prevSales.filter((s) => s.id !== deletedSaleId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Liste des ventes
        </CardTitle>
        <CardDescription>Historique de toutes les ventes enregistrées.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une vente (produit, client, notes)..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune vente trouvée.</p>
            <p className="text-sm mt-1">Essayez d'ajuster votre recherche ou enregistrez de nouvelles ventes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix Unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Plan de Prix</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-center">Actions</TableHead> {/* New Actions column */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.sale_date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{sale.products?.name || "N/A"}</TableCell>
                    <TableCell>{sale.clients?.name || "Client Inconnu"}</TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell className="text-right">{sale.unit_price.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">{sale.total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell>{sale.price_plan}</TableCell>
                    <TableCell className="text-sm text-gray-500">{sale.notes || "-"}</TableCell>
                    <TableCell className="text-center flex items-center justify-center gap-1">
                      <Link href={`/sales/${sale.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </Link>
                      <DeleteSaleDialog
                        saleId={sale.id}
                        productName={sale.products?.name || "Produit Inconnu"}
                        onDeleteSuccess={() => handleSaleDelete(sale.id)}
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
