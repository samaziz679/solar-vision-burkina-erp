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
import { deleteClient } from "@/app/clients/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
}

export function DeleteClientDialog({ open, onOpenChange, clientId }: DeleteClientDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteClient(clientId)
      toast.success("Client deleted successfully.")
      onOpenChange(false)
      router.refresh() // Refresh the list after deletion
    } catch (error: any) {
      toast.error("Failed to delete client.", {
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
            This action cannot be undone. This will permanently delete your client.
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
