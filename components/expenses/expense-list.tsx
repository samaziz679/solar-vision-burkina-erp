"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Expense } from "@/lib/supabase/types"
import DeleteExpenseDialog from "./delete-expense-dialog"

interface ExpenseListProps {
  expenses: Expense[]
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedExpenseId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedExpenseId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{new Date(expense.date).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell className="text-right">
                {expense.amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/expenses/${expense.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(expense.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedExpenseId && (
        <DeleteExpenseDialog expenseId={selectedExpenseId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
