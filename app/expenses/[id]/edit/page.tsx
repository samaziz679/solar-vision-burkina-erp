import { notFound } from "next/navigation"
import { getExpenseById } from "@/lib/data/expenses"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const id = params.id
  const expense = await getExpenseById(id)

  if (!expense) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm initialData={expense} />
        </CardContent>
      </Card>
    </div>
  )
}
