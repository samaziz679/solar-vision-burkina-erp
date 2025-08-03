import ExpenseForm from "@/components/expenses/expense-form"

export default function NewExpensePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nouvelle Dépense</h1>
      <ExpenseForm />
    </div>
  )
}
