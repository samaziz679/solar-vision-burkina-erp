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
import { toast } from "@/components/ui/use-toast"

interface DeleteSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId: string
}

export default function DeleteSupplierDialog({ open, onOpenChange, supplierId }: DeleteSupplierDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteSupplier(supplierId)
    if (result.success) {
      toast({
        title: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Échec de la suppression du fournisseur.",
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
            Cette action ne peut pas être annulée. Cela supprimera définitivement ce fournisseur de nos serveurs.
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
