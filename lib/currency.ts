/**
 * Currency utilities supporting:
 * - XOF (West African CFA franc, 0 fraction digits)
 * - RMB (ISO code CNY, 2 fraction digits)
 *
 * Choose currency via NEXT_PUBLIC_CURRENCY:
 *   - "XOF" (default)
 *   - "CNY" (RMB)
 */

export type SupportedCurrency = "XOF" | "CNY"

// Resolve active currency from env; accept "RMB" alias -> "CNY"
export function getActiveCurrency(): SupportedCurrency {
  const raw = (process.env.NEXT_PUBLIC_CURRENCY || "XOF").toUpperCase()
  if (raw === "CNY" || raw === "RMB") return "CNY"
  return "XOF"
}

function localeFor(code: SupportedCurrency): string {
  switch (code) {
    case "CNY":
      return "zh-CN"
    case "XOF":
    default:
      // French (Senegal) renders XOF nicely
      return "fr-SN"
  }
}

function digitsFor(code: SupportedCurrency): { min: number; max: number } {
  switch (code) {
    case "XOF":
      return { min: 0, max: 0 }
    case "CNY":
    default:
      return { min: 2, max: 2 }
  }
}

/**
 * formatMoney: Primary formatter used across the app.
 * - Respects NEXT_PUBLIC_CURRENCY (XOF default).
 * - Handles null/undefined gracefully.
 */
export function formatMoney(value: number | null | undefined, override?: SupportedCurrency): string {
  const code = override ?? getActiveCurrency()
  const loc = localeFor(code)
  const { min, max } = digitsFor(code)

  const amount = Number(value)
  const safe = Number.isFinite(amount) ? amount : 0

  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency: code,
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(safe)
  } catch {
    // Fallback if Intl fails for any reason
    return `${safe.toFixed(max)} ${code}`
  }
}

/** Optional helper if you need a plain numeric display (no symbol). */
export function formatAmount(value: number | null | undefined, override?: SupportedCurrency): string {
  const code = override ?? getActiveCurrency()
  const { max } = digitsFor(code)
  const amount = Number(value)
  const safe = Number.isFinite(amount) ? amount : 0
  return safe.toFixed(max)
}
