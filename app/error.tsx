"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

// Global error boundary for unexpected exceptions.
// This follows Next.js guidance for handling uncaught errors in App Router [^3][^4].
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Minimal logging; sensitive details are not shown to end users.
    console.error("GlobalError boundary captured", {
      name: error?.name,
      message: error?.message,
      digest: (error as any)?.digest,
    })
  }, [error])

  return (
    <html>
      <body className="min-h-svh flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-3 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            We hit an unexpected error while rendering this page. Please try again.
          </p>
          {(error as any)?.digest ? (
            <p className="text-xs text-muted-foreground">Error digest: {(error as any)?.digest}</p>
          ) : null}
          <div className="mt-3 flex justify-center gap-2">
            <Button onClick={() => reset()}>Try again</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
