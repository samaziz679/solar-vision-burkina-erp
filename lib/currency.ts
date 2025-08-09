export type CurrencyCode = "XOF" | "CNY"

// Returns the app currency from env (defaults to XOF)
export function getCurrencyCode(): CurrencyCode {
  const raw = (process.env.NEXT_PUBLIC_CURRENCY || "XOF").toUpperCase()
  return raw === "CNY" ? "CNY" : "XOF"
}

// Format a number according to the app currency (XOF &#47; CNY)
export function formatMoney(value: number | null | undefined, code?: CurrencyCode): string {
  if (value == null || Number.isNaN(Number(value))) return "—"
  const currency = code || getCurrencyCode()

  // XOF usually displays with 0 fractional digits
  const minimumFractionDigits = currency === "XOF" ? 0 : 2
  const maximumFractionDigits = currency === "XOF" ? 0 : 2

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(Number(value))
  } catch {
    // Fallback if Intl fails for any reason
    return `${Number(value).toFixed(maximumFractionDigits)} ${currency}`
  }
}
