"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log for client-side visibility; server logs already capture the stack.
    // eslint-disable-next-line no-console
    console.error("Global error boundary", error)
  }, [error])

  const digest = (error as any)?.digest

  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="mx-auto w-full max-w-lg rounded-lg border bg-background p-6 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again. If the problem persists, share the digest with support.
        </p>
        {digest ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Digest: <span className="font-mono">{digest}</span>
          </p>
        ) : null}
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  )
}
