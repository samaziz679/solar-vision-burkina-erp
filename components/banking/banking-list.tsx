"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { BankingAccount } from "@/lib/supabase/types"
import DeleteBankingDialog from "./delete-banking-dialog"

interface BankingListProps {
  bankingAccounts: BankingAccount[]
}

export default function BankingList({ bankingAccounts }: BankingListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setSelectedAccountId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedAccountId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du Compte</TableHead>
            <TableHead>Numéro de Compte</TableHead>
            <TableHead>Nom de la Banque</TableHead>
            <TableHead className="text-right">Solde</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankingAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.account_name}</TableCell>
              <TableCell>{account.account_number}</TableCell>
              <TableCell>{account.bank_name}</TableCell>
              <TableCell className="text-right">
                {account.balance.toLocaleString("fr-FR", { style: "currency", currency: "XOF" })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/banking/${account.id}/edit`}>Modifier</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(account.id)}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAccountId && (
        <DeleteBankingDialog accountId={selectedAccountId} isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} />
      )}
    </>
  )
}
