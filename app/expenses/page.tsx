import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseList, { ExpenseListSkeleton } from "@/components/expenses/expense-list"
import { getExpenses } from "@/lib/data/expenses"

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dépenses</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/expenses/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une dépense
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ExpenseListSkeleton />}>
            <ExpenseList expenses={expenses} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
