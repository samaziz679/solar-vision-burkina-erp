"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import DeleteProductDialog from "./delete-product-dialog"
import type { Product } from "@/lib/supabase/types"
import Image from "next/image"

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Unité</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix Achat</TableHead>
            <TableHead>Prix Vente (Détail 1)</TableHead>
            <TableHead>Prix Vente (Détail 2)</TableHead>
            <TableHead>Prix Vente (Gros)</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image ? (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md text-sm">No Image</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>
                {product.prix_achat.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_detail_1.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_detail_2.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                {product.prix_vente_gros.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
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
                      <Link href={`/inventory/${product.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(product.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
        />
      )}
    </>
  )
}
