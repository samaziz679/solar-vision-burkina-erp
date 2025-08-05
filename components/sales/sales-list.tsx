"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Sale } from "@/lib/supabase/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DeleteSaleDialog } from "./delete-sale-dialog"

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sale_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sale Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("sale_date"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "client_name",
    header: "Client",
  },
  {
    accessorKey: "product_name",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "unit_price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Unit Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const unitPrice = Number.parseFloat(row.getValue("unit_price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(unitPrice)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorFn: (row) => row.quantity * row.unit_price,
    id: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const total = row.original.quantity * row.original.unit_price
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sale = row.original
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/sales/${sale.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteSaleDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} saleId={sale.id} />
        </>
      )
    },
  },
]

interface SalesListProps {
  sales: Sale[]
}

export function SalesList({ sales }: SalesListProps) {
  return (
    <div className="w-full">
      <DataTable columns={columns} data={sales} filterColumnId="product_name" />
    </div>
  )
}
