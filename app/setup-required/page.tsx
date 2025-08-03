import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Configuration Requise</CardTitle>
          <CardDescription>
            Votre compte n'est pas encore configuré. Veuillez contacter l'administrateur pour l'activation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Retour à la connexion</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
