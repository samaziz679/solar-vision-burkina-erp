"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BankEntry } from "@/lib/supabase/types"
import DeleteBankingDialog from "./delete-banking-dialog"

interface BankingListProps {
  bankEntries: BankEntry[]
}

export default function BankingList({ bankEntries }: BankingListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedEntryId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedEntryId(null)
  }

  if (!bankEntries || bankEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune entrée bancaire trouvée.</p>
        <p className="text-sm mt-1">Ajoutez votre première entrée pour commencer.</p>
      </div>
    )
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
          {bankEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(new Date(entry.date), "dd MMMM yyyy", { locale: fr })}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className={entry.type === "deposit" ? "text-green-600" : "text-red-600"}>
                {entry.amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell>
                <Badge variant={entry.type === "deposit" ? "default" : "destructive"}>
                  {entry.type === "deposit" ? "Dépôt" : "Retrait"}
                </Badge>
              </TableCell>
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
          ))}
        </TableBody>
      </Table>
      {selectedEntryId && (
        <DeleteBankingDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          bankEntryId={selectedEntryId}
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}

export function BankingListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-2" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
        <div className="h-6 bg-gray-200 rounded col-span-1" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-2" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
          <div className="h-8 bg-gray-100 rounded col-span-1" />
        </div>
      ))}
    </div>
  )
}
