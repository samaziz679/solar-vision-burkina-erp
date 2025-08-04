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
import { deletePurchase } from "@/app/purchases/actions"
import { toast } from "sonner"

interface DeletePurchaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchaseId: string
}

export function DeletePurchaseDialog({ open, onOpenChange, purchaseId }: DeletePurchaseDialogProps) {
  const handleDelete = async () => {
    try {
      await deletePurchase(purchaseId)
      toast.success("Purchase deleted successfully.")
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to delete purchase.", {
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
            This action cannot be undone. This will permanently delete your purchase.
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
