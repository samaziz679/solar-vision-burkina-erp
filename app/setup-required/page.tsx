import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function SetupRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">

          <CardTitle className="text-2xl font-bold text-red-600">Configuration Requise</CardTitle>
          <CardDescription>Les variables d'environnement Supabase sont manquantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requises pour
              faire fonctionner l'application.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Étapes de configuration :</h3>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">1. Créer un projet Supabase</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Allez sur{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    supabase.com/dashboard
                   
                  </a>{" "}
                  et créez un nouveau projet.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">2. Obtenir les clés API</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Dans votre projet Supabase, allez dans Settings → API pour obtenir :
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Project URL</li>
                  <li>Anon/Public key</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">3. Configurer les variables d'environnement</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Créez un fichier <code className="bg-gray-100 px-1 rounded">.env.local</code> à la racine de votre
                  projet avec :
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase`}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">4. Exécuter le schéma de base de données</h4>
                <p className="text-sm text-gray-600">
                  Dans l'éditeur SQL de Supabase, exécutez le script{" "}
                  <code className="bg-gray-100 px-1 rounded">supabase_schema.sql</code> fourni dans le projet.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">5. Redémarrer l'application</h4>
                <p className="text-sm text-gray-600">
                  Après avoir configuré les variables d'environnement, redémarrez votre serveur de développement.
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Une fois la configuration terminée, cette page disparaîtra automatiquement et vous serez redirigé vers la
              page de connexion.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
