"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const BankingForm = dynamic(() => import("@/components/banking/banking-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { createBanking } from "@/app/banking/actions"

export default function NewBankingPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle transaction bancaire</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={createBanking} />
        </CardContent>
      </Card>
    </div>
  )
}
