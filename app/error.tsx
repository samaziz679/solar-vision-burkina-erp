"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error boundary:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || "An unexpected server error occurred."}</p>
        {error?.digest ? <p className="text-xs text-muted-foreground">Digest: {error.digest}</p> : null}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-neutral-50">
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
