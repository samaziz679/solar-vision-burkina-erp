"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import DeleteBankEntryDialog from "./delete-banking-dialog"
import type { BankEntry } from "@/lib/supabase/types"
import { format } from "date-fns"

interface BankEntryListProps {
  bankEntries: BankEntry[]
}

export default function BankEntryList({ bankEntries }: BankEntryListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBankEntryId, setSelectedBankEntryId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedBankEntryId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell>{entry.amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/banking/${entry.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(entry.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedBankEntryId && (
        <DeleteBankEntryDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          bankEntryId={selectedBankEntryId}
        />
      )}
    </>
  )
}
