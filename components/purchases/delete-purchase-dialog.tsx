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
import { toast } from "sonner"

interface DeletePurchaseDialogProps {
  purchaseId: string
  isOpen: boolean
  onClose: () => void
}

export default function DeletePurchaseDialog({ purchaseId, isOpen, onClose }: DeletePurchaseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deletePurchase(purchaseId)
    if (result.message) {
      toast.success(result.message)
      onClose()
    } else {
      toast.error("Échec de la suppression de l'achat.", {
        description: "Une erreur est survenue lors de la suppression. Veuillez réessayer.",
      })
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement cet achat de votre base de données et
            ajustera le stock du produit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
