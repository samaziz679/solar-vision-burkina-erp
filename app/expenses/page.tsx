import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getExpenses } from "@/lib/data/expenses"
import ExpenseList from "@/components/expenses/expense-list"

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Dépenses</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/expenses/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une dépense
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Dépenses</CardTitle>
          <CardDescription>Gérez vos dépenses d'entreprise.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}
