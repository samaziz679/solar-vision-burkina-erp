import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BankingForm } from "@/components/banking/banking-form"
import { requireAuth } from "@/lib/auth"

export default async function NewBankingPage() {
  await requireAuth()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Banking Entry</CardTitle>
        <CardDescription>Fill in the details for the new banking entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <BankingForm />
      </CardContent>
    </Card>
  )
}
