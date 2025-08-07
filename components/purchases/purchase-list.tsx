'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Purchase } from '@/lib/supabase/types'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-react'
import { DeletePurchaseDialog } from './delete-purchase-dialog'
import { format } from 'date-fns'

interface PurchaseListProps {
  purchases: Purchase[]
}

export function PurchaseList({ purchases }: PurchaseListProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedPurchaseId(id)
    setIsDeleteDialogOpen(true)
  }

  const columns: ColumnDef<Purchase>[] = [
    {
      accessorKey: 'supplier_name', // Assuming you'll join this from suppliers table
      header: 'Supplier',
      cell: ({ row }) => row.original.suppliers?.name || 'N/A',
    },
    {
      accessorKey: 'product_name', // Assuming you'll join this from products table
      header: 'Product',
      cell: ({ row }) => row.original.products?.name || 'N/A',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'purchase_date',
      header: 'Purchase Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('purchase_date'))
        return <div>{format(date, 'PPP')}</div>
      },
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('total_amount'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'XOF', // Assuming XOF as default currency for purchases
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/purchases/${row.original.id}/edit`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(row.original.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={purchases} />
      {selectedPurchaseId && (
        <DeletePurchaseDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          purchaseId={selectedPurchaseId}
        />
      )}
    </>
  )
}
