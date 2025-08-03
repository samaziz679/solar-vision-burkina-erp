import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { getExpenseById } from "@/lib/data/expenses"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const expense = await getExpenseById(params.id, data.user.id)

  if (!expense) {
    redirect("/expenses")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Expense</h1>
        <ExpenseForm initialData={expense} />
      </div>
    </div>
  )
}
