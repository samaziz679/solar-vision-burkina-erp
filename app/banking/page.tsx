import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { BankingAccount } from "@/lib/supabase/types"
import { getBankingAccounts } from "@/lib/data/banking"
import BankingList from "@/components/banking/banking-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function BankingPage() {
  const cookieStore = cookies()
  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-muted-foreground">Veuillez vous connecter pour voir les comptes bancaires.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    )
  }

  const { bankingAccounts, error } = await getBankingAccounts(user.id)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-destructive">Erreur lors du chargement des comptes bancaires: {error.message}</p>
      </div>
    )
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Comptes Bancaires</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/banking/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un compte</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des comptes bancaires</CardTitle>
          <CardDescription>Gérez vos comptes bancaires et leurs soldes.</CardDescription>
        </CardHeader>
        <CardContent>
          {bankingAccounts && bankingAccounts.length > 0 ? (
            <BankingList bankingAccounts={bankingAccounts as BankingAccount[]} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun compte bancaire trouvé.</p>
              <p className="text-muted-foreground">
                Cliquez sur &quot;Ajouter un compte&quot; pour en créer un nouveau.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
