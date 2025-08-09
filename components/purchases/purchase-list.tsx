"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import type { Purchase } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type PurchaseRow = Purchase & {
  // Support joined relations if present
  suppliers?: { name?: string | null } | null
  products?: { name?: string | null } | null
  // Support flat aliased fields if queries project them
  supplier_name?: string | null
  product_name?: string | null
}

const columns: ColumnDef<PurchaseRow>[] = [
  {
    accessorKey: "supplier_name",
    header: "Supplier",
    cell: ({ row }) => row.original.supplier_name ?? row.original.suppliers?.name ?? "N/A",
  },
  {
    accessorKey: "product_name",
    header: "Product",
    cell: ({ row }) => row.original.product_name ?? row.original.products?.name ?? "N/A",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ getValue }) => {
      const val = Number(getValue() as number)
      if (Number.isNaN(val)) return "—"
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      }).format(val)
    },
  },
  {
    accessorKey: "purchase_date",
    header: "Date",
    cell: ({ getValue }) => {
      const v = getValue() as string | Date | null
      if (!v) return "—"
      const d = typeof v === "string" ? new Date(v) : v
      return Number.isNaN(d.getTime()) ? "—" : format(d, "PP")
    },
  },
]

export function PurchaseList({ data }: { data: PurchaseRow[] }) {
  return (
    <div className={cn("w-full")}>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
