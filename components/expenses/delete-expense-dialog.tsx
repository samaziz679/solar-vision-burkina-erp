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
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type DeleteExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseId: string
}

export function DeleteExpenseDialog({ open, onOpenChange, expenseId }: DeleteExpenseDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteExpense(expenseId)
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Expense deleted successfully.",
      })
      router.refresh()
    }
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this expense.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
