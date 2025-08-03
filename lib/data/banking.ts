import { createClient } from "@/lib/supabase/server"

export async function getBankingTransactions(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error)
    return []
  }
  return data
}

export async function getBankingTransactionById(id: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching banking transaction:", error)
    return null
  }
  return data
}

export async function getBankingSummary(userId: string) {
  const supabase = createClient()

  const { data: incomeData, error: incomeError } = await supabase
    .from("banking_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "income")

  if (incomeError) {
    console.error("Error fetching income:", incomeError)
    return { totalIncome: 0, totalExpense: 0, netBalance: 0 }
  }

  const totalIncome = incomeData.reduce((sum, transaction) => sum + transaction.amount, 0)

  const { data: expenseData, error: expenseError } = await supabase
    .from("banking_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "expense")

  if (expenseError) {
    console.error("Error fetching expenses:", expenseError)
    return { totalIncome, totalExpense: 0, netBalance: totalIncome }
  }

  const totalExpense = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0)

  const netBalance = totalIncome - totalExpense

  return { totalIncome, totalExpense, netBalance }
}

export async function getBankingChartData(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("amount, type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching banking chart data:", error)
    return []
  }

  const monthlyData: { [key: string]: { income: number; expense: number } } = {}

  data.forEach((transaction) => {
    const month = new Date(transaction.created_at).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    })
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }
    if (transaction.type === "income") {
      monthlyData[month].income += transaction.amount
    } else {
      monthlyData[month].expense += transaction.amount
    }
  })

  return Object.keys(monthlyData).map((month) => ({
    name: month,
    Income: monthlyData[month].income,
    Expense: monthlyData[month].expense,
  }))
}
