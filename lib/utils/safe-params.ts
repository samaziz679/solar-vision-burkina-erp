export type SearchParams = Record<string, string | string[] | undefined>

/**
 * Safely pick a single string value from Next.js App Router searchParams object.
 * On the server, searchParams is a plain record, not URLSearchParams.
 */
export function pickParam(sp: SearchParams | undefined, key: string): string | null {
  const v = sp?.[key]
  if (Array.isArray(v)) return v[0] ?? null
  return v ?? null
}

/**
 * Safely pick a number from searchParams. Returns null if missing or invalid.
 */
export function pickNumber(sp: SearchParams | undefined, key: string): number | null {
  const s = pickParam(sp, key)
  if (s == null) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}
