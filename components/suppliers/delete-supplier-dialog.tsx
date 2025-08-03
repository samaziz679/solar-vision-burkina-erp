"use client"

import { useFormState } from "react-dom"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash, Loader2 } from "lucide-react"
import { deleteSale } from "@/app/sales/actions"
import { useState, useEffect } from "react"

interface DeleteSaleDialogProps {
  saleId: string
  productName: string
  onDeleteSuccess: () => void // Callback to notify parent of successful deletion
}

export default function DeleteSaleDialog({ saleId, productName, onDeleteSuccess }: DeleteSaleDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useFormState(deleteSale, { error: null, success: false })

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false) // Close dialog on success
      onDeleteSuccess() // Notify parent component
    }
    // Optionally, handle error state here if you want to display it in the dialog
    // if (state?.error) {
    //   console.error("Deletion error:", state.error);
    // }
  }, [state, onDeleteSuccess])

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:text-red-600"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Supprimer</span>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement la vente du produit{" "}
            <span className="font-semibold">{productName}</span> et remettra la quantité en stock.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={saleId} />
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
