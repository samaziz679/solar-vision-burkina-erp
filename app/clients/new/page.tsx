export const dynamic = "force-dynamic"
export const revalidate = 0

import ClientForm from "@/components/clients/client-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import type { SearchParams } from "@/lib/utils/safe-params"

export default function NewClientPage({
  // Keep optional; never call .get on the server. Use safe helpers if needed.
  searchParams,
}: {
  searchParams?: SearchParams
}) {
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
              <Link href="/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>New Client</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm />
        </CardContent>
      </Card>
    </main>
  )
}
