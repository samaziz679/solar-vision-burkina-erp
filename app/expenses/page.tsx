import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ExpenseList } from "@/components/expenses/expense-list"
import { getExpenses } from "@/lib/data/expenses"
import { requireAuth } from "@/lib/auth"

export default async function ExpensesPage() {
  await requireAuth()
  const expenses = await getExpenses()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Expenses</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/expenses/new">
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Add New Expense
            </Link>
          </Button>
        </div>
      </div>
      <ExpenseList expenses={expenses} />
    </div>
  )
}
