import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExpenseById } from "@/lib/data/expenses"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const expense = await getExpenseById(params.id, user.id)

  if (!expense) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <ExpenseForm initialData={expense} />
      </CardContent>
    </Card>
  )
}
