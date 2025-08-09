"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { error, reset } = props

  useEffect(() => {
    // Log to server console for correlation with Vercel logs
    // eslint-disable-next-line no-console
    console.error("[App Error Boundary]", error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">
        An unexpected error occurred while rendering this page.
        {error.digest ? ` Digest: ${error.digest}` : ""}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/api/diagnostics" target="_blank" rel="noreferrer">
            Open diagnostics
          </a>
        </Button>
      </div>
    </div>
  )
}
