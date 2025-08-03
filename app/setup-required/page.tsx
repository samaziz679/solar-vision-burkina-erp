import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configuration Requise</CardTitle>
          <CardDescription>
            Il semble que votre base de données ne soit pas encore configurée ou que des données essentielles soient
            manquantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Veuillez vous assurer que votre base de données Supabase est correctement configurée et que les scripts de
            schéma et d'insertion de données ont été exécutés.
          </p>
          <Button asChild>
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
