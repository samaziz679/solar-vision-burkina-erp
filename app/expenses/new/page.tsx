import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { requireAuth } from "@/lib/auth"

export default async function NewExpensePage() {
  await requireAuth()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Expense</CardTitle>
        <CardDescription>Fill in the details for the new expense.</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseForm />
      </CardContent>
    </Card>
  )
}
