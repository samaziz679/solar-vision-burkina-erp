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
import { deleteSupplier } from "@/app/suppliers/actions"
import { toast } from "sonner"

interface DeleteSupplierDialogProps {
  supplierId: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteSupplierDialog({ supplierId, isOpen, onClose }: DeleteSupplierDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteSupplier(supplierId)
    if (result.message) {
      toast.success(result.message)
      onClose()
    } else {
      toast.error("Échec de la suppression du fournisseur.", {
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
            Cette action ne peut pas être annulée. Cela supprimera définitivement ce fournisseur de votre base de
            données.
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
