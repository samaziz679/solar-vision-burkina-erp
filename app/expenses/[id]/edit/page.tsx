import { getExpenseById } from "@/lib/data/expenses"
import ExpenseForm from "@/components/expenses/expense-form"
import { notFound } from "next/navigation"

interface EditExpensePageProps {
  params: {
    id: string
  }
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const expense = await getExpenseById(params.id)

  if (!expense) {
    notFound() // Show 404 if expense not found
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modifier Dépense: {expense.description}</h1>
      <ExpenseForm expense={expense} />
    </div>
  )
}
