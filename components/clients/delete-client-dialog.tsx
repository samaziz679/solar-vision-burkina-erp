"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
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
  onClose: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <AlertDialogAction type="submit" disabled={pending}>
      {pending ? "Suppression..." : "Supprimer"}
    </AlertDialogAction>
  )
}

export default function DeleteClientDialog({ open, onOpenChange, clientId, onClose }: DeleteClientDialogProps) {
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (formData: FormData) => {
    const result = await deleteClient(clientId)
    if (result?.error) {
      setError(result.error)
      toast({
        title: "Erreur de suppression",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      })
      onClose()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement ce client de votre base de données.
          </AlertDialogDescription>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <form action={handleDelete}>
            <SubmitButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
