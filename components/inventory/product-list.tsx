"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/supabase/types"
import DeleteProductDialog from "./delete-product-dialog"
import Image from "next/image"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedProductId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedProductId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.image_url || "/placeholder.svg?height=40&width=40&text=Product"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="text-right">
                {product.price.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
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
                      <Link href={`/inventory/${product.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(product.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProductId && (
        <DeleteProductDialog productId={selectedProductId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
