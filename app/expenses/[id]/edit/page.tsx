import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { getExpenseById } from "@/lib/data/expenses"

export default async function EditExpensePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const expense = await getExpenseById(params.id, user.id)

  if (!expense) {
    redirect("/expenses")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Expense</h2>
        <ExpenseForm initialData={expense} />
      </div>
    </div>
  )
}
