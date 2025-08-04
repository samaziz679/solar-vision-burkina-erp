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
import { deleteSale } from "@/app/sales/actions"
import { toast } from "sonner"

interface DeleteSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  saleId: string
}

export function DeleteSaleDialog({ open, onOpenChange, saleId }: DeleteSaleDialogProps) {
  const handleDelete = async () => {
    try {
      await deleteSale(saleId)
      toast.success("Sale deleted successfully.")
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to delete sale.", {
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
            This action cannot be undone. This will permanently delete your sale.
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
