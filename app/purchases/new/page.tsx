export const dynamic = "force-dynamic"
export const revalidate = 0

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { getAdminClient } from "@/lib/supabase/admin"
import type { ComponentType } from "react"

// Flexible import (default or named) and relax types
import * as PurchaseFormNS from "@/components/purchases/purchase-form"
const PurchaseForm = (PurchaseFormNS.default ?? (PurchaseFormNS as any).PurchaseForm) as ComponentType<any>

export default async function NewPurchasePage() {
  const supabase = getAdminClient()

  const [{ data: productsData, error: prodErr }, { data: suppliersData, error: suppErr }] = await Promise.all([
    supabase.from("products").select("id,name,prix_achat").order("name", { ascending: true }),
    supabase.from("suppliers").select("id,name").order("name", { ascending: true }),
  ])

  if (prodErr || suppErr) {
    console.error("purchases/new preload error:", { prodErr, suppErr })
    throw new Error("Failed to load prerequisites for purchase form.")
  }

  const products =
    (productsData ?? []).map((p: any) => ({
      id: String(p.id),
      name: String(p.name ?? ""),
      prix_achat: p.prix_achat != null ? Number(p.prix_achat) : 0,
    })) ?? []

  const suppliers = (suppliersData ?? []).map((s: any) => ({ id: String(s.id), name: String(s.name ?? "") }))

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/purchases">Purchases</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>New Purchase</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add New Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </main>
  )
}
