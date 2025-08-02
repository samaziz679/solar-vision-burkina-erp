"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Client } from "@/lib/supabase/types"
import DeleteClientDialog from "./delete-client-dialog"

interface ClientListProps {
  clients: Client[]
}

export default function ClientList({ clients }: ClientListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedClientId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedClientId(null)
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun client trouvé.</p>
        <p className="text-sm mt-1">Ajoutez votre premier client pour commencer.</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/clients/${client.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(client.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedClientId && (
        <DeleteClientDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          clientId={selectedClientId}
          onClose={handleCloseDialog}
        />
      )}
    </>
  )
}
