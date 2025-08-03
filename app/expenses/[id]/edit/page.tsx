import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditExpenseForm from "@/components/expenses/edit-expense-form"
import { getExpenseById } from "@/lib/data/expenses"
import { updateExpense } from "@/app/expenses/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const expense = await getExpenseById(params.id)

  if (!expense) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Modifier la dépense</CardTitle>
          <CardDescription>Mettez à jour les détails de la dépense.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditExpenseForm initialData={expense} action={updateExpense} />
        </CardContent>
      </Card>
    </div>
  )
}
