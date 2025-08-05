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
import { deleteBankingTransaction } from "@/app/banking/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteBankingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId: string
}

export function DeleteBankingDialog({ open, onOpenChange, transactionId }: DeleteBankingDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteBankingTransaction(transactionId)
      toast.success("Transaction deleted successfully.")
      onOpenChange(false)
      router.refresh() // Refresh the list after deletion
    } catch (error: any) {
      toast.error("Failed to delete transaction.", {
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
            This action cannot be undone. This will permanently delete your banking transaction.
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
