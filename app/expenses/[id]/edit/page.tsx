import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { getExpenseById } from "@/lib/data/expenses"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditExpensePageProps = {
  params: { id: string }
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  await requireAuth()
  const expense = await getExpenseById(params.id)

  if (!expense) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Expense</CardTitle>
        <CardDescription>Update the details for this expense.</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseForm initialData={expense} />
      </CardContent>
    </Card>
  )
}
