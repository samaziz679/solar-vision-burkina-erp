import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExpenseList } from "@/components/expenses/expense-list"
import { getExpenses } from "@/lib/data/expenses"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ExpensesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const expenses = await getExpenses(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Expenses</CardTitle>
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Expense
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ExpenseList expenses={expenses} />
      </CardContent>
    </Card>
  )
}
