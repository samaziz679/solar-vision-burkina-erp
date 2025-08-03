import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getExpenseById } from "@/lib/data/expenses"
import { updateExpense } from "@/app/expenses/actions"

const ExpenseForm = dynamic(() => import("@/components/expenses/expense-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const id = params.id
  const { data: expense, error } = await getExpenseById(id)

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>
  }

  if (!expense) {
    return <div className="text-gray-500">Dépense non trouvée.</div>
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier la dépense</CardTitle>
          <CardDescription>Mettez à jour les détails de la dépense.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm action={updateExpense} initialData={expense} />
        </CardContent>
      </Card>
    </div>
  )
}
