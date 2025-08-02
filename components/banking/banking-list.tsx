"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { BankEntry } from "@/lib/supabase/types"
import DeleteBankingDialog from "./delete-banking-dialog"

interface BankingListProps {
  bankEntries: BankEntry[]
}

export default function BankingList({ bankEntries }: BankingListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBankEntryId, setSelectedBankEntryId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedBankEntryId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedBankEntryId(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucune entrée bancaire trouvée.
              </TableCell>
            </TableRow>
          ) : (
            bankEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), "dd MMMM yyyy", { locale: fr })}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className={entry.type === "deposit" ? "text-green-600" : "text-red-600"}>
                  {entry.amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
                </TableCell>
                <TableCell>{entry.type === "deposit" ? "Dépôt" : "Retrait"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/banking/${entry.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedBankEntryId && (
        <DeleteBankingDialog
          open={isDeleteDialogOpen}
          onOpenChange={handleCloseDeleteDialog}
          bankEntryId={selectedBankEntryId}
        />
      )}
    </>
  )
}

export function BankingListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
