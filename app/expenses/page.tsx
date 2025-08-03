import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getExpenses } from "@/lib/data/expenses"
import ExpenseList from "@/components/expenses/expense-list"

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dépenses</h1>
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Enregistrer une dépense
          </Link>
        </Button>
      </div>
      <ExpenseList expenses={expenses} />
    </div>
  )
}
