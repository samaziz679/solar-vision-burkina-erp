"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const PurchaseForm = dynamic(() => import("@/components/purchases/purchase-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { createPurchase } from "@/app/purchases/actions"

export default function NewPurchasePage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouvel achat</CardTitle>
          <CardDescription>Remplissez les détails du nouvel achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm action={createPurchase} />
        </CardContent>
      </Card>
    </div>
  )
}
