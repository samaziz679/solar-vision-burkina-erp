import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Setup Required</CardTitle>
          <CardDescription>It looks like your Supabase database schema is not fully set up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please ensure you have run the `complete_supabase_schema_final_correction_v2.sql` script in your Supabase
            SQL Editor.
          </p>
          <p>
            This script creates all necessary tables, enums, and RLS policies for the application to function correctly.
          </p>
          <Button asChild>
            <Link href="https://app.supabase.com/project/_/sql" target="_blank" rel="noopener noreferrer">
              Go to Supabase SQL Editor
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            After running the script, you may need to refresh this page or redeploy your application.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
