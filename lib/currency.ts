const CURRENCY = (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_CURRENCY || "").toUpperCase()) || "XOF"

type Supported = "XOF" | "CNY"

function getLocaleForCurrency(code: Supported): string {
  switch (code) {
    case "CNY":
      return "zh-CN"
    case "XOF":
    default:
      // West Africa French locale renders XOF sensibly
      return "fr-SN"
  }
}

function getMinimumFractionDigits(code: Supported): number {
  switch (code) {
    case "XOF":
      return 0
    case "CNY":
    default:
      return 2
  }
}

export function formatCurrency(value: number | null | undefined, currency?: Supported): string {
  const code = (currency || (CURRENCY as Supported)) as Supported
  const locale = getLocaleForCurrency(code)
  const digits = getMinimumFractionDigits(code)
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount)
  } catch {
    // Fallback if Intl throws for any reason
    const postfix = ` ${code}`
    return `${amount.toFixed(digits)}${postfix}`
  }
}

export function getActiveCurrency(): Supported {
  return (CURRENCY as Supported) || "XOF"
}
