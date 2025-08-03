"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const SaleForm = dynamic(() => import("@/components/sales/sale-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { createSale } from "@/app/sales/actions"

export default function NewSalePage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle vente</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle vente.</CardDescription>
        </CardHeader>
        <CardContent>
          <SaleForm action={createSale} />
        </CardContent>
      </Card>
    </div>
  )
}
