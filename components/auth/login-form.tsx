"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Helper function to get the correct URL for redirects
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/" // Default for local development

  // Ensure it starts with https:// for production or http:// for localhost
  url = url.startsWith("http") ? url : `https://${url}`
  // Ensure it has a trailing slash
  url = url.endsWith("/") ? url : `${url}/`
  return url
}

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Construct the redirect URL using the robust getURL helper
      const redirectToUrl = `${getURL()}auth/callback`
      console.log("Attempting to sign in with emailRedirectTo:", redirectToUrl) // Debug log for Vercel logs

      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectToUrl,
        },
      })

      if (supabaseError) {
        setError(supabaseError.message)
        console.error("Supabase signInWithOtp error:", supabaseError)
      } else {
        setMessage("Vérifiez votre email pour le lien de connexion magique!")
      }
    } catch (err: any) {
      setError("Une erreur est survenue: " + (err.message || "Vérifiez votre connexion ou les logs console."))
      console.error("General fetch error caught in LoginForm:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            {/* Removed Mail icon usage here */}
          </div>
          <CardTitle className="text-2xl font-bold">Solar Vision Burkina</CardTitle>
          <CardDescription>Système de gestion commerciale</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? // Replaced Loader2 with simple text
                  "Envoi en cours..."
                : "Envoyer le lien magique"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Un lien de connexion sera envoyé à votre email</p>
            <p className="mt-2">Pas de mot de passe requis!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
