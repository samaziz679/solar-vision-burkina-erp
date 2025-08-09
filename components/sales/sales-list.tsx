"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import type { Sale } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type SaleRow = Sale & {
  // Support joined relations if present
  clients?: { name?: string | null } | null
  products?: { name?: string | null } | null
  // Support flat aliased fields if queries project them
  client_name?: string | null
  product_name?: string | null
}

const columns: ColumnDef<SaleRow>[] = [
  {
    accessorKey: "client_name",
    header: "Client",
    cell: ({ row }) => row.original.client_name ?? row.original.clients?.name ?? "N/A",
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
    accessorKey: "sale_date",
    header: "Date",
    cell: ({ getValue }) => {
      const v = getValue() as string | Date | null
      if (!v) return "—"
      const d = typeof v === "string" ? new Date(v) : v
      return Number.isNaN(d.getTime()) ? "—" : format(d, "PP")
    },
  },
]

export function SalesList({ data }: { data: SaleRow[] }) {
  return (
    <div className={cn("w-full")}>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
