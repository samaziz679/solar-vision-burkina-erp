"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SetupRequiredPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "Additional setup is required to use this feature."

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Setup Required</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Please navigate to the relevant section to add the necessary data.</p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/inventory/new">Add New Product</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/clients/new">Add New Client</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/suppliers/new">Add New Supplier</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/banking/new">Add New Banking Account</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
