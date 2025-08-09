export type SearchParams = Record<string, string | string[] | undefined>

/**
 * Safely read a string value from Next.js App Router searchParams (server-side).
 * searchParams in server components is a plain object, not URLSearchParams.
 */
export function pickParam(sp: SearchParams | undefined, key: string): string | null {
  const v = sp?.[key]
  if (Array.isArray(v)) return v[0] ?? null
  return v ?? null
}

/**
 * Safely read a number value (returns null if missing or invalid).
 */
export function pickNumber(sp: SearchParams | undefined, key: string): number | null {
  const s = pickParam(sp, key)
  if (s == null) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}
