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
import { deleteProduct } from "@/app/inventory/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
}

export function DeleteProductDialog({ open, onOpenChange, productId }: DeleteProductDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteProduct(productId)
      toast.success("Product deleted successfully.")
      onOpenChange(false)
      router.refresh() // Refresh the list after deletion
    } catch (error: any) {
      toast.error("Failed to delete product.", {
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
            This action cannot be undone. This will permanently delete your product.
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
