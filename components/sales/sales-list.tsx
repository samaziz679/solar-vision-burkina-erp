"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import type { Sale } from "@/lib/supabase/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DeleteSaleDialog } from "./delete-sale-dialog"
import { format } from "date-fns"

// Support both flat and joined shapes
export type SalesRow = Sale & {
  // Optional joined relations
  clients?: { name?: string | null } | null
  products?: { name?: string | null } | null
  // Or flat aliased columns from SELECT
  client_name?: string | null
  product_name?: string | null
}

// Backward-compatible props: allow either `sales` or `data`
type SalesListProps = { sales: SalesRow[] } | { data: SalesRow[] }

export function SalesList(props: SalesListProps) {
  const sales = "sales" in props ? props.sales : props.data

  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  const columns: ColumnDef<SalesRow>[] = [
    {
      accessorKey: "client_name",
      header: "Client",
      cell: ({ row }) => {
        const name = row.original.client_name ?? row.original.clients?.name
        return <div>{name ?? "N/A"}</div>
      },
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => {
        const prod = row.original.product_name ?? row.original.products?.name
        return <div>{prod ?? "N/A"}</div>
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
        return <div>{isNaN(date.getTime()) ? "—" : format(date, "PPP")}</div>
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = Number(row.getValue("total_amount"))
        if (Number.isNaN(amount)) return <div className="font-medium">—</div>
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "XOF",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
              <MoreHorizontal className="h-4 w-4" />
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
