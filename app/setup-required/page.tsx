import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configuration Requise</CardTitle>
          <CardDescription>
            Votre compte n'est pas encore entièrement configuré. Veuillez contacter l'administrateur.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Pour accéder à toutes les fonctionnalités de l'application, une configuration initiale est nécessaire.
          </p>
          <Button asChild>
            <Link href="/dashboard">Retour au Tableau de Bord</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
