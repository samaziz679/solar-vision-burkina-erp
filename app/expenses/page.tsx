import { getExpenses } from "@/lib/data/expenses"
import { ExpenseList } from "@/components/expenses/expense-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Expenses</CardTitle>
          <Link href="/expenses/new">
            <Button>Add New Expense</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}
