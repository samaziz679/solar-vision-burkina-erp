import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewExpensePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <ExpenseForm />
      </CardContent>
    </Card>
  )
}
