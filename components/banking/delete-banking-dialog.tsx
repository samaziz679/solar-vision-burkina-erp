"use client"

import { useTransition } from "react"
import { toast } from "sonner"
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
import { deleteBankEntry } from "@/app/banking/actions"

interface DeleteBankingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bankEntryId: string
}

export default function DeleteBankingDialog({ open, onOpenChange, bankEntryId }: DeleteBankingDialogProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteBankEntry(bankEntryId)
        toast.success("Entrée bancaire supprimée avec succès.")
        onOpenChange(false)
      } catch (error) {
        toast.error("Échec de la suppression de l'entrée bancaire.")
        console.error("Failed to delete bank entry:", error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement cette entrée bancaire de votre base de
            données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
