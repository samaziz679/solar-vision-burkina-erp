import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SetupRequiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 text-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">Configuration Requise</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-md">
        Il semble que votre base de données Supabase n&apos;est pas encore configurée ou que les variables
        d&apos;environnement sont manquantes.
      </p>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Veuillez suivre les instructions dans le fichier `DEPLOYMENT_GUIDE.md` ou `README.md` pour configurer votre
        projet Supabase et vos variables d&apos;environnement.
      </p>
      <Button asChild>
        <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
          Aller au tableau de bord Supabase
        </Link>
      </Button>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Après la configuration, actualisez cette page.</p>
    </div>
  )
}
