import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser, getUserRoles } from "@/lib/auth"
import Sidebar from "@/components/layout/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const userRoles = await getUserRoles(user.id)

  if (userRoles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Votre compte n'a pas encore été configuré avec les rôles appropriés.</p>
          <p className="text-gray-600 mt-2">Veuillez contacter l'administrateur.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRoles={userRoles} />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
