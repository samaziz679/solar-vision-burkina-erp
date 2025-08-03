"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const ClientForm = dynamic(() => import("@/components/clients/client-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { createClient } from "@/app/clients/actions"

export default function NewClientPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouveau client</CardTitle>
          <CardDescription>Remplissez les détails du nouveau client.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm action={createClient} />
        </CardContent>
      </Card>
    </div>
  )
}
