"use client"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"

interface DeleteBankEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bankEntryId: string
}

export default function DeleteBankEntryDialog({ open, onOpenChange, bankEntryId }: DeleteBankEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteBankEntry(bankEntryId)
    if (result.success) {
      toast({
        title: "Opération supprimée",
        description: "L'opération bancaire a été supprimée avec succès.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Échec de la suppression de l'opération bancaire.",
        variant: "destructive",
      })
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement cette opération bancaire de nos
            serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
