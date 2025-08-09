"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import type { Sale } from "@/lib/supabase/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { DeleteSaleDialog } from "./delete-sale-dialog"
import { format } from "date-fns"

type SaleRow = Sale & {
  // Optional joined relations (when you select with joins)
  clients?: { name?: string | null } | null
  products?: { name?: string | null } | null
  // Optional flat columns (when you select aliased columns in SQL)
  client_name?: string | null
  product_name?: string | null
}

interface SalesListProps {
  sales: SaleRow[]
}

export function SalesList({ sales }: SalesListProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  const columns: ColumnDef<SaleRow>[] = [
    {
      accessorKey: "client_name",
      header: "Client",
      cell: ({ row }) => {
        const name = row.original.clients?.name ?? row.original.client_name ?? "N/A"
        return <div>{name || "N/A"}</div>
      },
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => {
        const name = row.original.products?.name ?? row.original.product_name ?? "N/A"
        return <div>{name || "N/A"}</div>
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "sale_date",
      header: "Sale Date",
      cell: ({ row }) => {
        const raw = row.getValue("sale_date") as string | Date
        const date = typeof raw === "string" ? new Date(raw) : raw
        return <div>{date && !isNaN(date.getTime()) ? format(date, "PPP") : "—"}</div>
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = Number(row.getValue("total_amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "XOF",
        }).format(isFinite(amount) ? amount : 0)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/sales/${row.original.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(row.original.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={sales} />
      {selectedSaleId && (
        <DeleteSaleDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} saleId={selectedSaleId} />
      )}
    </>
  )
}
