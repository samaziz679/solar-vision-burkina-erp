"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteExpense } from "@/app/expenses/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseId: string
}

export function DeleteExpenseDialog({ open, onOpenChange, expenseId }: DeleteExpenseDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteExpense(expenseId)
      toast.success("Expense deleted successfully.")
      onOpenChange(false)
      router.refresh() // Refresh the list after deletion
    } catch (error: any) {
      toast.error("Failed to delete expense.", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your expense.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
