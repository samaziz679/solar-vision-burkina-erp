import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseForm from "@/components/expenses/expense-form"
import { getExpenseById } from "@/lib/data/expenses"
import { updateExpense } from "@/app/expenses/actions"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const expense = await getExpenseById(params.id)

  if (!expense) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier la dépense</CardTitle>
          <CardDescription>Mettez à jour les détails de la dépense.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm action={updateExpense} initialData={expense} />
        </CardContent>
      </Card>
    </div>
  )
}
