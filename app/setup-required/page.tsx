"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SetupRequiredPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "Some initial setup is required before you can proceed."

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Setup Required</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please ensure you have created necessary entities like banking accounts, clients, products, or suppliers.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/banking/new">Create Banking Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/clients/new">Create Client</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/inventory/new">Create Product</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/suppliers/new">Create Supplier</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
