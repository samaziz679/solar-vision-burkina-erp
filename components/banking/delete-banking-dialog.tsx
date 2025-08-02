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
import { deleteBankEntry } from "@/app/banking/actions"
import { toast } from "@/components/ui/use-toast"

interface DeleteBankingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bankEntryId: string
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

export default function DeleteBankingDialog({ open, onOpenChange, bankEntryId, onClose }: DeleteBankingDialogProps) {
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (formData: FormData) => {
    const result = await deleteBankEntry(bankEntryId)
    if (result?.error) {
      setError(result.error)
      toast({
        title: "Erreur de suppression",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Entrée supprimée",
        description: "L'entrée bancaire a été supprimée avec succès.",
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
            Cette action ne peut pas être annulée. Cela supprimera définitivement cette entrée bancaire de votre base de
            données.
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
