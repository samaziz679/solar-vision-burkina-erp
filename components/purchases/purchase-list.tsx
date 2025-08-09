"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import type { Purchase } from "@/lib/supabase/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DeletePurchaseDialog } from "./delete-purchase-dialog"
import { format } from "date-fns"

// Accept both flat and joined shapes from your fetchPurchases()
export type PurchaseRow = Purchase & {
  // Optional joined objects
  products?: { name?: string | null } | null
  suppliers?: { name?: string | null } | null
  // Or flat denormalized names
  product_name?: string | null
  supplier_name?: string | null
}

interface PurchaseListProps {
  purchases: PurchaseRow[]
}

export function PurchaseList({ purchases }: PurchaseListProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedPurchaseId(id)
    setIsDeleteDialogOpen(true)
  }

  const columns: ColumnDef<PurchaseRow>[] = [
    {
      accessorKey: "supplier_name",
      header: "Supplier",
      cell: ({ row }) => {
        const sup = row.original.supplier_name ?? row.original.suppliers?.name
        return <div>{sup ?? "N/A"}</div>
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
      accessorKey: "purchase_date",
      header: "Purchase Date",
      cell: ({ row }) => {
        const raw = row.getValue("purchase_date") as string | Date
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
            <DropdownMenuItem onClick={() => router.push(`/purchases/${row.original.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(row.original.id)}>Delete</DropdownMenuItem>
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
