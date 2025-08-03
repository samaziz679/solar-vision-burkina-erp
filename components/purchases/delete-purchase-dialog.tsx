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
import { deletePurchase } from "@/app/purchases/actions"
import { toast } from "@/components/ui/use-toast"

interface DeletePurchaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchaseId: string
}

export default function DeletePurchaseDialog({ open, onOpenChange, purchaseId }: DeletePurchaseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deletePurchase(purchaseId)
    if (result.success) {
      toast({
        title: "Achat supprimé",
        description: "L'achat a été supprimé avec succès.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Échec de la suppression de l'achat.",
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
            Cette action ne peut pas être annulée. Cela supprimera définitivement cet achat de nos serveurs.
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
