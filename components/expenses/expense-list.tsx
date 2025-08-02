"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, CreditCard, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Expense } from "@/lib/supabase/types"
import DeleteExpenseDialog from "./delete-expense-dialog"

interface ExpenseListProps {
  expenses: Expense[]
}

export default function ExpenseList({ expenses: initialExpenses }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expenses, setExpenses] = useState(initialExpenses)

  useState(() => {
    setExpenses(initialExpenses)
  }, [initialExpenses])

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExpenseDelete = (deletedExpenseId: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((e) => e.id !== deletedExpenseId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Liste des dépenses
        </CardTitle>
        <CardDescription>Historique de toutes les dépenses enregistrées.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une dépense (description, catégorie, notes)..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune dépense trouvée.</p>
            <p className="text-sm mt-1">Essayez d'ajuster votre recherche ou enregistrez de nouvelles dépenses.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.expense_date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">{expense.amount.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-sm text-gray-500">{expense.notes || "-"}</TableCell>
                    <TableCell className="text-center flex items-center justify-center gap-1">
                      <Link href={`/expenses/${expense.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </Link>
                      <DeleteExpenseDialog
                        expenseId={expense.id}
                        expenseDescription={expense.description}
                        onDeleteSuccess={() => handleExpenseDelete(expense.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
