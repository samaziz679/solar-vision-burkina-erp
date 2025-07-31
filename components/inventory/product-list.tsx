"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import type { Product } from "@/lib/supabase/types"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
         
          Liste des produits
        </CardTitle>
        <CardDescription>Gérez votre inventaire de produits solaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
         
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun produit trouvé.</p>
            <p className="text-sm mt-1">Essayez d'ajuster votre recherche ou ajoutez de nouveaux produits.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix Achat</TableHead>
                  <TableHead className="text-right">Prix Vente (D1)</TableHead>
                  <TableHead className="text-right">Prix Vente (D2)</TableHead>
                  <TableHead className="text-right">Prix Vente (Gros)</TableHead>
                  <TableHead className="text-center">Seuil Bas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell className="text-right">
                      {product.quantity}
                      {product.quantity <= product.seuil_stock_bas && (
                        <Badge variant="destructive" className="ml-2">
                         
                          Faible
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.prix_achat.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">
                      {product.prix_vente_detail_1.toLocaleString("fr-FR")} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      {product.prix_vente_detail_2.toLocaleString("fr-FR")} FCFA
                    </TableCell>
                    <TableCell className="text-right">{product.prix_vente_gros.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-center">{product.seuil_stock_bas}</TableCell>
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

