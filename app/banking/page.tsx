import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getBankEntries } from "@/lib/data/banking"
import BankEntryList from "@/components/banking/banking-list"

export default async function BankingPage() {
  const bankEntries = await getBankEntries()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Opérations Bancaires</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/banking/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une opération
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Opérations Bancaires</CardTitle>
          <CardDescription>Gérez vos entrées et sorties d'argent.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankEntryList bankEntries={bankEntries} />
        </CardContent>
      </Card>
    </div>
  )
}
