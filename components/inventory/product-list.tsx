'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type Product = {
  id: string | number
  name: string
  sku?: string
  price?: number
  stock?: number
  unit?: string
}

type ProductListProps = {
  products?: Product[]
  showActions?: boolean
}

export default function ProductList({
  products = [],
  showActions = true,
}: ProductListProps) {
  const fmt = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  })

  const hasData = products && products.length > 0

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption className="text-xs">
          {hasData ? 'Inventory overview' : 'No products found'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Name</TableHead>
            <TableHead className="min-w-[120px]">SKU</TableHead>
            <TableHead className="text-right min-w-[120px]">Price</TableHead>
            <TableHead className="text-right min-w-[100px]">Stock</TableHead>
            <TableHead className="min-w-[80px]">Unit</TableHead>
            {showActions && <TableHead className="text-right min-w-[160px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasData ? (
            products.map((p) => (
              <TableRow key={String(p.id)}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.sku || '-'}</TableCell>
                <TableCell className="text-right">{p.price != null ? fmt.format(p.price) : '-'}</TableCell>
                <TableCell className="text-right">{p.stock ?? '-'}</TableCell>
                <TableCell>{p.unit || '-'}</TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/inventory/${p.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      {/* If you have a DeleteProductDialog, wire it here; otherwise keep a placeholder */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => alert(`Delete product ${p.name}`)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center">
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
