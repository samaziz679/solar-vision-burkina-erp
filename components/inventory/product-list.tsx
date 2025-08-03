"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image" // Import Image from next/image
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase/types"
import DeleteProductDialog from "./delete-product-dialog"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProductId(null)
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun produit trouvé.</p>
        <p className="text-sm mt-1">Ajoutez votre premier produit pour commencer.</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Image</TableHead> {/* Add this line */}
            <TableHead>Quantité</TableHead>
            <TableHead>Unité</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix Achat</TableHead>
            <TableHead>Prix Vente (Détail 1)</TableHead>
            <TableHead>Prix Vente (Détail 2)</TableHead>
            <TableHead>Prix Vente (Gros)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                {" "}
                {/* Add this TableCell */}
                {product.image ? (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-gray-400 text-xs">
                    No Img
                  </div>
                )}
              </TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>
                {product.prix_achat?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_detail_1?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_detail_2?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_gros?.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/inventory/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(product.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedProductId && (
        <DeleteProductDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          productId={selectedProductId}
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-4">
        {" "}
        {/* Changed from grid-cols-9 to grid-cols-10 */}
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" /> {/* New placeholder for image */}
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
        <div key={i} className="grid grid-cols-10 gap-4">
          {" "}
          {/* Changed from grid-cols-9 to grid-cols-10 */}
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" /> {/* New placeholder for image */}
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
