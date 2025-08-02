import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BankingList, { BankingListSkeleton } from "@/components/banking/banking-list"
import { fetchBankEntries } from "@/lib/data/banking"

export default async function BankingPage() {
  const bankEntries = await fetchBankEntries()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Entrées Bancaires</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/banking/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une entrée
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Entrées Bancaires</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<BankingListSkeleton />}>
            <BankingList bankEntries={bankEntries} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
