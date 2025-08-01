"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, AlertTriangle, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase/types"
import DeleteProductDialog from "./delete-product-dialog" // Import the new component

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products: initialProducts }: ProductListProps) {
  // Rename prop to initialProducts
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(initialProducts) // Manage products state locally for immediate UI update

  // Update products state when initialProducts prop changes (e.g., after revalidation)
  useState(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleProductDelete = (deletedProductId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== deletedProductId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Liste des produits
        </CardTitle>
        <CardDescription>Gérez votre inventaire de produits solaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  <TableHead className="text-center">Actions</TableHead>
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
                          <AlertTriangle className="h-3 w-3 mr-1" />
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
                    <TableCell className="text-center flex items-center justify-center gap-1">
                      <Link href={`/inventory/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </Link>
                      <DeleteProductDialog
                        productId={product.id}
                        productName={product.name}
                        onDeleteSuccess={() => handleProductDelete(product.id)}
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
