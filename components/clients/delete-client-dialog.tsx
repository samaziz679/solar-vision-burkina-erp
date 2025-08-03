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
import { deleteClient } from "@/app/clients/actions"
import { toast } from "@/components/ui/use-toast"

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
}

export default function DeleteClientDialog({ open, onOpenChange, clientId }: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteClient(clientId)
    if (result.success) {
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Échec de la suppression du client.",
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
            Cette action ne peut pas être annulée. Cela supprimera définitivement ce client de nos serveurs.
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
