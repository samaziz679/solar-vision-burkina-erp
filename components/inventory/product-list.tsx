'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/supabase/types'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function onDeleteClick(id?: string | null) {
    if (!id) return
    setSelectedId(id)
    setIsDeleteOpen(true)
    // If you have a real delete dialog/action, wire it here.
  }

  function onCloseDelete() {
    setSelectedId(null)
    setIsDeleteOpen(false)
  }

  const getPrice = (p: any) => {
    const val =
      typeof p?.price === 'number'
        ? p.price
        : typeof p?.unit_price === 'number'
          ? p.unit_price
          : Number(p?.price ?? 0)
    return Number.isFinite(val) ? val.toFixed(2) : '0.00'
  }

  const getQty = (p: any) =>
    typeof p?.stock_quantity === 'number'
      ? p.stock_quantity
      : typeof p?.stockQuantity === 'number'
        ? p.stockQuantity
        : typeof p?.quantity === 'number'
          ? p.quantity
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
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: any) => {
              const id = product?.id ?? product?.sku ?? product?.name
              return (
                <TableRow key={String(id)}>
                  <TableCell>{product?.name ?? '—'}</TableCell>
                  <TableCell className="max-w-[420px] truncate">{product?.description ?? '—'}</TableCell>
                  <TableCell>${getPrice(product)}</TableCell>
                  <TableCell>{getQty(product)}</TableCell>
                  <TableCell>{product?.sku ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product?.id ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/inventory/${product.id}/edit`}>
                            <PencilIcon className="mr-1 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteClick(product?.id ?? null)}
                        disabled={!product?.id}
                      >
                        <TrashIcon className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Accessible, no-op placeholder for delete UX (prevents build-time errors).
          Replace with your real dialog when ready. */}
      {isDeleteOpen && selectedId ? (
        <div className="sr-only" aria-live="polite">
          {'Delete requested for product id: '}{selectedId}
          {' — replace placeholder with your DeleteProductDialog and call onCloseDelete() to close.'}
        </div>
      ) : null}
    </>
  )
}

ProductList.defaultProps = {
  products: [],
}
