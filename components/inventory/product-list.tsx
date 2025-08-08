'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { type Product } from '@/lib/supabase/types'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  function handleDeleteClick(id: string) {
    setSelectedProductId(id)
    setIsDeleteDialogOpen(true)
    // If you have a DeleteProductDialog component, you can render it here.
    // For now, we just open state; integrating the dialog can be done later.
  }

  function handleCloseDialog() {
    setIsDeleteDialogOpen(false)
    setSelectedProductId(null)
  }

  const formatPrice = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value ?? 0)
    return num.toFixed(2)
  }

  const stockQty =
    (product: any) =>
      typeof product?.stock_quantity === 'number'
        ? product.stock_quantity
        : typeof product?.stockQuantity === 'number'
          ? product.stockQuantity
          : 0

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={(product as any).id ?? (product as any).sku}>
                <TableCell>{(product as any).name ?? '—'}</TableCell>
                <TableCell className="max-w-[420px] truncate">
                  {(product as any).description ?? '—'}
                </TableCell>
                <TableCell>${formatPrice((product as any).price)}</TableCell>
                <TableCell>{stockQty(product)}</TableCell>
                <TableCell>{(product as any).sku ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/inventory/${(product as any).id}/edit`}>
                        <PencilIcon className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick((product as any).id)}
                    >
                      <TrashIcon className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Placeholder for a delete dialog; close it by calling handleCloseDialog */}
      {isDeleteDialogOpen && selectedProductId ? (
        <div className="sr-only" aria-live="polite">
          {'Delete dialog would open for product ID: '}{selectedProductId}
        </div>
      ) : null}
    </>
  )
}

ProductList.defaultProps = {
  products: [],
}
