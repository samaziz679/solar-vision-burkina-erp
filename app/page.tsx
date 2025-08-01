import { redirect } from "next/navigation"

export default async function HomePage() {
  // The middleware already handles redirection to /login or /setup-required
  // if the user is not authenticated or env vars are missing.
  // If we reach this page, it means the middleware allowed it,
  // so we can safely redirect to the dashboard.
  redirect("/dashboard")
}
