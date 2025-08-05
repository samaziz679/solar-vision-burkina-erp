import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupRequiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-600">Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            It looks like your Supabase database is not fully set up.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            Please ensure you have run the necessary SQL scripts to create tables and policies. Refer to the
            `DEPLOYMENT_GUIDE.md` file in your project for detailed instructions.
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
