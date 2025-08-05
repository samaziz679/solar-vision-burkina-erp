"use client"

import { useState } from "react"
import type { Product } from "@/lib/supabase/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DeleteProductDialog } from "./delete-product-dialog"
import Image from "next/image"

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProductId(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <Image
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-[50px] w-[50px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/inventory/${product.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedProductId && (
        <DeleteProductDialog productId={selectedProductId} isOpen={isDeleteDialogOpen} onClose={handleCloseDialog} />
      )}
    </>
  )
}
