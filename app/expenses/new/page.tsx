import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { createExpense } from "@/app/expenses/actions"

const ExpenseForm = dynamic(() => import("@/components/expenses/expense-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default function NewExpensePage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle dépense</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle dépense.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm action={createExpense} />
        </CardContent>
      </Card>
    </div>
  )
}
